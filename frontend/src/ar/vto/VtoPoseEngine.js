/**
 * VtoPoseEngine.js — ported from softwear (TechAngelX/softwear)
 * 
 * Positions and scales a 3D garment model to fit the detected body.
 * Uses MediaPipe Holistic pose landmarks (shoulder + hip midpoint)
 * to drive position, scale, and Y-axis rotation of the garment.
 * 
 * Smoothing via lerp/slerp for jitter-free tracking.
 */

import * as THREE from 'three'

const LANDMARKS = {
  LEFT_SHOULDER:  11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP:       23,
  RIGHT_HIP:      24,
}

export class VtoPoseEngine {
  constructor() {
    this.targetPosition  = new THREE.Vector3()
    this.currentPosition = new THREE.Vector3()
    this.targetScale     = new THREE.Vector3(1, 1, 1)
    this.currentScale    = new THREE.Vector3(1, 1, 1)
    this.currentRotation = new THREE.Quaternion()

    this.isMobile            = window.innerWidth <= 768
    this.lastValidLandmarks  = null
    this.lostFrameCount      = 0
    this.lostFrameThreshold  = 15   // ~0.5s grace period

    this.shoulderMidpoint = new THREE.Vector3()
    this.hipMidpoint      = new THREE.Vector3()
  }

  /**
   * Update garment position/scale/rotation from MediaPipe pose landmarks.
   * @param {Array}  landmarks  - MediaPipe Holistic poseLandmarks array
   * @param {Object} garmentModel - THREE.Group (the loaded GLB scene)
   * @param {THREE.Camera} camera
   */
  update(landmarks, garmentModel, camera) {
    if (!landmarks || !garmentModel || !camera) {
      if (garmentModel) garmentModel.visible = false
      return
    }

    const LS = landmarks[LANDMARKS.LEFT_SHOULDER]
    const RS = landmarks[LANDMARKS.RIGHT_SHOULDER]
    const LH = landmarks[LANDMARKS.LEFT_HIP]
    const RH = landmarks[LANDMARKS.RIGHT_HIP]

    const visThr = this.isMobile ? 0.1 : 0.45

    const shouldersVisible = LS && RS &&
      (LS.visibility ?? 1) > visThr && (RS.visibility ?? 1) > visThr

    if (!shouldersVisible) {
      this.lostFrameCount++
      if (this.lostFrameCount <= this.lostFrameThreshold && this.lastValidLandmarks) {
        garmentModel.visible = true   // freeze at last position
        return
      }
      garmentModel.visible = false
      return
    }

    this.lostFrameCount = 0
    garmentModel.visible = true

    // ═══ Calculate garment anchor point (softwear approach) ═══
    const shoulderMidX = (LS.x + RS.x) / 2
    const shoulderMidY = (LS.y + RS.y) / 2
    const shoulderWidth = Math.abs(LS.x - RS.x)
    
    // Try to use actual hips for better torso measurement
    const hipsVisible = LH && RH &&
      (LH.visibility ?? 1) > visThr && (RH.visibility ?? 1) > visThr
    
    let anchorY
    let torsoHeight = 0
    
    if (hipsVisible) {
      // Use real hip position
      const hipMidY = (LH.y + RH.y) / 2
      torsoHeight = hipMidY - shoulderMidY
      
      // Position garment at MID-CHEST (not collar!)
      // Most 3D garment models have pivot at center/chest, not neckline
      anchorY = shoulderMidY + (torsoHeight * 0.35)  // 35% down toward hips = chest level
    } else {
      // Estimate: use larger fixed offset to reach chest area
      // In normalized space, chest is ~0.15-0.20 below shoulders
      torsoHeight = shoulderWidth * 1.5
      
      // Anchor at chest level - use fixed offset in normalized coords
      anchorY = shoulderMidY + 0.18  // Fixed offset to chest (was too small before)
    }
    
    const zOff = (LS.z + RS.z) / 2

    this.targetPosition.set(shoulderMidX, anchorY, zOff)
    this._projectToWorld(this.targetPosition, camera)

    // ── Scale: based on torso dimensions (softwear approach) ──
    // Primary reference: shoulder width (most stable)
    // Secondary: torso height for aspect ratio
    const SCALE_RATIO = this.isMobile ? 3.0 : 4.0
    let targetScaleVal = shoulderWidth * SCALE_RATIO
    
    // Clamp to reasonable range
    targetScaleVal = Math.max(0.6, Math.min(2.8, targetScaleVal))

    // ── Rotation: yaw from shoulder Z difference ──
    const shoulderZDiff = LS.z - RS.z
    const yaw = shoulderZDiff * 2.5
    const targetQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), yaw
    )

    // ── Smooth lerp/slerp ──
    const lerpF = this.isMobile ? 0.7 : 0.25
    this.currentPosition.lerp(this.targetPosition, lerpF)
    this.currentScale.lerp(this.targetScale.set(targetScaleVal, targetScaleVal, targetScaleVal), lerpF)
    this.currentRotation.slerp(targetQuat, lerpF)

    garmentModel.position.copy(this.currentPosition)
    garmentModel.scale.copy(this.currentScale)
    garmentModel.quaternion.copy(this.currentRotation)
  }

  /** Convert normalized landmark [0..1] coords → Three.js world coords using camera frustum */
  _projectToWorld(vector, camera) {
    if (!camera) {
      // Fallback: simple [0,1] → [-aspect, aspect] mapping
      const aspect = 1.78
      vector.x = (vector.x - 0.5) * 2 * aspect
      vector.y = -(vector.y - 0.5) * 2        // flip Y: media Y-down → Three.js Y-up
      vector.z = 0
      return
    }

    // Handle orthographic camera (used by AREngine)
    if (camera.isOrthographicCamera) {
      // Map normalized [0,1] DIRECTLY to camera frustum bounds (NO extra scale)
      // MediaPipe: Y is 0 at top, 1 at bottom
      // Three.js: Y is +top at top, -1 at bottom
      
      const frustumWidth  = camera.right - camera.left      // e.g., 3.56
      const frustumHeight = camera.top - camera.bottom       // e.g., 2.00
      
      // Convert normalized coords to frustum space
      vector.x = (vector.x - 0.5) * frustumWidth            // scaled to [-frustumWidth/2, +frustumWidth/2]
      vector.y = -(vector.y - 0.5) * frustumHeight          // flip Y and scale to frustum
      vector.z = 0.5
      
      return
    }

    // Handle perspective camera (fallback)
    const fov    = camera.fov || 60
    const aspect = camera.aspect || 1.78
    const targetZ = this.isMobile ? 0.3 : 0.5
    const vFOV    = fov * Math.PI / 180
    const height  = 2 * Math.tan(vFOV / 2) * Math.abs(targetZ - (camera.position?.z ?? 2))
    const width   = height * aspect

    vector.x = (vector.x - 0.5) * width
    vector.y = -(vector.y - 0.5) * height
    vector.z = targetZ
  }
}
