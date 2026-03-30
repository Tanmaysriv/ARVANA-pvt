/**
 * transformUtils.js — v2
 * Converts 2D MediaPipe landmark positions into Three.js transforms.
 *
 * COORDINATE SYSTEM:
 *  - MediaPipe landmarks: x,y in [0..1] (normalized to video frame, top-left origin)
 *  - Three.js orthographic camera: x in [-aspect..aspect], y in [-1..1]
 *  - We mirror X (multiply by -1) so left hand appears on the user's left side
 *
 * SCALE CALIBRATION:
 *  - Camera: OrthographicCamera(-aspect, aspect, 1, -1) at z=2
 *  - 1 unit in Three.js = half the canvas height
 *  - palmWidth in landmark space ≈ 0.12–0.20 of frame width
 *  - We scale models so they match realistic proportions
 */

import * as THREE from 'three'
import { angle, distance, midpoint, PoseLandmark, HandLandmark } from './poseUtils.js'

// ── Shared color resolver ──
export function resolveColor(color) {
  if (!color) return 0x888888
  if (typeof color === 'number') return color
  const s = color.trim().toLowerCase()
  const map = {
    black: '#1c1c1e', white: '#f0f0f0', red: '#c0392b', blue: '#1a3a6b',
    navy: '#0d1b3e', gray: '#808080', brown: '#5c3a1e', tan: '#c9996b',
    beige: '#d6c4a0', silver: '#a8aaad', gold: '#c9a84c', 'rose gold': '#b76e79',
    'light blue': '#6ea8d4', pink: '#d63384', purple: '#6f42c1', orange: '#c74a00',
    yellow: '#c9a800', green: '#1e5c2e', 'dark green': '#1a3d2b', cream: '#f5f0e8',
  }
  return parseInt((map[s] || s).replace('#', ''), 16)
}

// ── Normalize landmark to Three.js orthographic space ──
// aspect should be canvas.width / canvas.height
// NOTE: Video is mirrored at display time via ctx.scale(-1,1) in composite.
// So we must flip X here to align Three.js overlay with mirrored video display.
function toOrtho(lm, aspect = 1.78) {
  const x = (lm.x - 0.5) * 2 * aspect * -1   // mirror X to match video display mirror
  const y = -(lm.y - 0.5) * 2                 // flip Y (canvas Y is down, Three.js Y is up)
  return { x, y, z: 0 }
}

// ──────────────────────────────────────────────
// WATCH / WRIST transform
// ──────────────────────────────────────────────
export function getWatchTransform(handLandmarks, videoWidth = 1280, videoHeight = 720, handedness = 'Right') {
  if (!handLandmarks || handLandmarks.length < 21) return null

  const aspect = videoWidth / videoHeight
  const wrist     = handLandmarks[HandLandmark.WRIST]
  const indexMCP  = handLandmarks[HandLandmark.INDEX_FINGER_MCP]
  const pinkyMCP  = handLandmarks[HandLandmark.PINKY_MCP]
  const middleMCP = handLandmarks[HandLandmark.MIDDLE_FINGER_MCP]

  const pos = toOrtho(wrist, aspect)

  // Palm width in normalized [0..1] space — convert to ortho space for scale
  const palmWidthNorm   = distance(indexMCP, pinkyMCP)        // ~0.12–0.20
  const palmWidthOrtho  = palmWidthNorm * 2 * aspect          // in Three.js units

  // Watch should be ~1.3× palm width (the face); strap extends further but that's fine
  // The watch model's total local height (strap + case) is ~2.0, so scale must be small
  const watchScale = palmWidthOrtho * 0.5

  // Wrist rotation: angle of wrist → middle finger in screen space
  // We add π/2 (not subtract) because Y is flipped: screen Y-down vs Three.js Y-up
  const wristAngle = angle(wrist, middleMCP)
  const rotZ = wristAngle + Math.PI / 2

  // For left hand, mirror the rotation
  const finalRotZ = handedness === 'Left' ? rotZ + Math.PI : rotZ

  return {
    position: new THREE.Vector3(pos.x, pos.y, 0),
    rotation: new THREE.Euler(0, 0, finalRotZ),
    scale:    new THREE.Vector3(watchScale, watchScale, watchScale),
  }

}

// ──────────────────────────────────────────────
// RING transform (specific finger)
// ──────────────────────────────────────────────
export function getRingTransform(handLandmarks, finger = 'ring', videoWidth = 1280, videoHeight = 720) {
  if (!handLandmarks) return null
  const aspect = videoWidth / videoHeight

  const fingerMap = {
    index:  { base: HandLandmark.INDEX_FINGER_MCP,  pip: HandLandmark.INDEX_FINGER_PIP  },
    middle: { base: HandLandmark.MIDDLE_FINGER_MCP, pip: HandLandmark.MIDDLE_FINGER_PIP },
    ring:   { base: HandLandmark.RING_FINGER_MCP,   pip: HandLandmark.RING_FINGER_PIP   },
    pinky:  { base: HandLandmark.PINKY_MCP,          pip: HandLandmark.PINKY_PIP          },
  }

  const { base: bIdx, pip: pIdx } = fingerMap[finger] || fingerMap.ring
  const base = handLandmarks[bIdx]
  const pip  = handLandmarks[pIdx]
  if (!base || !pip) return null

  const mid = midpoint(base, pip)
  const pos = toOrtho(mid, aspect)

  const fingerLen  = distance(base, pip) * 2 * aspect
  const ringScale  = fingerLen * 0.65

  // Same Y-flip correction as watch: use +π/2 not -π/2
  const fingerAngle = angle(base, pip)
  const rotZ = fingerAngle + Math.PI / 2

  return {
    position: new THREE.Vector3(pos.x, pos.y, 0),
    rotation: new THREE.Euler(0, 0, rotZ),
    scale:    new THREE.Vector3(ringScale, ringScale, ringScale),
  }
}

// ──────────────────────────────────────────────
// SHOE / FOOT transform
// ──────────────────────────────────────────────
export function getShoeTransform(poseLandmarks, side = 'right', videoWidth = 1280, videoHeight = 720) {
  if (!poseLandmarks) return null
  const aspect = videoWidth / videoHeight

  const ankleIdx = side === 'right' ? PoseLandmark.RIGHT_ANKLE     : PoseLandmark.LEFT_ANKLE
  const heelIdx  = side === 'right' ? PoseLandmark.RIGHT_HEEL      : PoseLandmark.LEFT_HEEL
  const toeIdx   = side === 'right' ? PoseLandmark.RIGHT_FOOT_INDEX : PoseLandmark.LEFT_FOOT_INDEX
  const kneeIdx  = side === 'right' ? PoseLandmark.RIGHT_KNEE      : PoseLandmark.LEFT_KNEE

  const ankle = poseLandmarks[ankleIdx]
  const heel  = poseLandmarks[heelIdx]
  const toe   = poseLandmarks[toeIdx]
  const knee  = poseLandmarks[kneeIdx]

  if (!ankle || !heel || !toe) return null
  if ((ankle.visibility ?? 1) < 0.35) return null

  // Center of foot (midpoint heel→toe), shifted slightly toward heel for shoe anchor
  const footCenter = { x: heel.x * 0.4 + toe.x * 0.6, y: heel.y * 0.4 + toe.y * 0.6 }
  const pos = toOrtho(footCenter, aspect)

  // Foot length in ortho space → shoe length
  const footLenNorm = distance(heel, toe)
  const footLenOrtho = footLenNorm * 2 * aspect
  const shoeScale   = footLenOrtho * 1.6   // shoe is slightly longer than foot

  // Foot direction angle (heel → toe), +π/2 correction for Y-flip like watch
  const footAngle = angle(heel, toe) + Math.PI / 2

  // Mirror left foot
  const finalAngle = side === 'left' ? footAngle + Math.PI : footAngle

  return {
    position: new THREE.Vector3(pos.x, pos.y, 0),
    rotation: new THREE.Euler(0, 0, finalAngle),
    scale:    new THREE.Vector3(shoeScale, shoeScale * 0.40, shoeScale),
  }
}

// ──────────────────────────────────────────────
// BAG / ARM transform
// ──────────────────────────────────────────────
export function getBagTransform(poseLandmarks, side = 'right', videoWidth = 1280, videoHeight = 720) {
  if (!poseLandmarks) return null
  const aspect = videoWidth / videoHeight

  const wristIdx    = side === 'right' ? PoseLandmark.RIGHT_WRIST    : PoseLandmark.LEFT_WRIST
  const elbowIdx    = side === 'right' ? PoseLandmark.RIGHT_ELBOW    : PoseLandmark.LEFT_ELBOW
  const shoulderIdx = side === 'right' ? PoseLandmark.RIGHT_SHOULDER : PoseLandmark.LEFT_SHOULDER

  const wrist    = poseLandmarks[wristIdx]
  const elbow    = poseLandmarks[elbowIdx]
  const shoulder = poseLandmarks[shoulderIdx]

  if (!wrist || (wrist.visibility ?? 1) < 0.3) return null

  // Bag hangs at wrist — the bag model's pivot is at its top (body has translate(0,-0.5,0))
  // so placing group at wrist makes the bag hang naturally below
  const pos = toOrtho(wrist, aspect)

  // Scale from shoulder-elbow distance — capped to prevent giant overlay on bad landmarks
  const armLen  = (elbow && shoulder) ? distance(shoulder, elbow) : 0.18
  const bagScale = Math.min(armLen * 2 * aspect * 0.7, 0.65)

  return {
    position: new THREE.Vector3(pos.x, pos.y, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale:    new THREE.Vector3(bagScale, bagScale, bagScale),
  }
}

// ──────────────────────────────────────────────
// CLOTHES / TORSO transform
// ──────────────────────────────────────────────
export function getClothesTransform(poseLandmarks, videoWidth = 1280, videoHeight = 720) {
  if (!poseLandmarks) return null
  const aspect = videoWidth / videoHeight

  const ls = poseLandmarks[PoseLandmark.LEFT_SHOULDER]
  const rs = poseLandmarks[PoseLandmark.RIGHT_SHOULDER]
  const lh = poseLandmarks[PoseLandmark.LEFT_HIP]
  const rh = poseLandmarks[PoseLandmark.RIGHT_HIP]

  if (!ls || !rs || !lh || !rh) return null
  if ((ls.visibility ?? 1) < 0.35 || (rs.visibility ?? 1) < 0.35) return null

  const shoulderMid = midpoint(ls, rs)
  const pos         = toOrtho(shoulderMid, aspect)  // anchor at shoulder midpoint
  const swNorm      = distance(ls, rs)               // shoulder width in [0..1]

  // Scale.x = shoulder half-width in ortho space (used by ClothesRenderer to calibrate GLB)
  const scaleX = swNorm * 2 * aspect * 0.55

  return {
    position: new THREE.Vector3(pos.x, pos.y, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale:    new THREE.Vector3(scaleX, scaleX, scaleX),
  }
}
