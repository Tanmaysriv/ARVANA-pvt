/**
 * poseUtils.js
 * Math helpers for working with MediaPipe 2D landmark coordinates.
 * All landmark coordinates are normalized [0..1] relative to frame size.
 */

/**
 * Convert normalized landmark to pixel coordinates
 */
export function toPixel(landmark, width, height) {
  return {
    x: landmark.x * width,
    y: landmark.y * height,
    z: landmark.z || 0,
  }
}

/**
 * Euclidean distance between two landmarks (in normalized coords)
 */
export function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

/**
 * Euclidean distance in pixel space
 */
export function pixelDistance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

/**
 * Midpoint between two landmarks
 */
export function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: ((a.z || 0) + (b.z || 0)) / 2,
  }
}

/**
 * Angle (in radians) of the vector from a → b, relative to horizontal
 */
export function angle(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x)
}

/**
 * Convert radians to degrees
 */
export function toDeg(rad) {
  return (rad * 180) / Math.PI
}

/**
 * Convert degrees to radians
 */
export function toRad(deg) {
  return (deg * Math.PI) / 180
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Smooth a series of landmark positions over time using exponential smoothing.
 * alpha closer to 1 = faster (less smooth), closer to 0 = slower (more smooth)
 */
export function smoothLandmark(prev, next, alpha = 0.5) {
  if (!prev) return next
  return {
    x: lerp(prev.x, next.x, alpha),
    y: lerp(prev.y, next.y, alpha),
    z: lerp(prev.z || 0, next.z || 0, alpha),
  }
}

/**
 * Get the bounding box for a set of landmarks
 */
export function getBoundingBox(landmarks) {
  if (!landmarks || landmarks.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const lm of landmarks) {
    if (lm.x < minX) minX = lm.x
    if (lm.y < minY) minY = lm.y
    if (lm.x > maxX) maxX = lm.x
    if (lm.y > maxY) maxY = lm.y
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
}

/**
 * Check if landmark has sufficient visibility (confidence)
 */
export function isVisible(landmark, threshold = 0.5) {
  return landmark && (landmark.visibility === undefined || landmark.visibility > threshold)
}

/**
 * MediaPipe Pose landmark indices (BlazePose 33-point model)
 */
export const PoseLandmark = {
  NOSE: 0,
  LEFT_EYE_INNER: 1, LEFT_EYE: 2, LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4, RIGHT_EYE: 5, RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7, RIGHT_EAR: 8,
  MOUTH_LEFT: 9, MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
  LEFT_WRIST: 15, RIGHT_WRIST: 16,
  LEFT_PINKY: 17, RIGHT_PINKY: 18,
  LEFT_INDEX: 19, RIGHT_INDEX: 20,
  LEFT_THUMB: 21, RIGHT_THUMB: 22,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
  LEFT_HEEL: 29, RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31, RIGHT_FOOT_INDEX: 32,
}

/**
 * MediaPipe Hands landmark indices (21-point model)
 */
export const HandLandmark = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5, INDEX_FINGER_PIP: 6, INDEX_FINGER_DIP: 7, INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9, MIDDLE_FINGER_PIP: 10, MIDDLE_FINGER_DIP: 11, MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13, RING_FINGER_PIP: 14, RING_FINGER_DIP: 15, RING_FINGER_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
}
