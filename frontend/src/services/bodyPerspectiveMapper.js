/**
 * Maps body pose to perspective transforms for realistic AR overlay
 * Calculates rotation, scale, and deformation based on body movement
 */

// Calculate body rotation angle from keypoints
export const getBodyRotation = (kp) => {
  const ls = kp?.find(k => k.name === 'left_shoulder')
  const rs = kp?.find(k => k.name === 'right_shoulder')
  if (!ls || !rs) return 0

  // Angle between shoulders (z-axis rotation)
  const dy = rs.y - ls.y
  const dx = rs.x - ls.x
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

// Calculate torso tilt from hip/shoulder alignment
export const getTorsoTilt = (kp) => {
  const ls = kp?.find(k => k.name === 'left_shoulder')
  const lh = kp?.find(k => k.name === 'left_hip')
  if (!ls || !lh) return 0

  // Forward/backward lean
  const torsoVector = { x: lh.x - ls.x, y: lh.y - ls.y }
  return Math.atan2(torsoVector.y, torsoVector.x) * (180 / Math.PI)
}

// Calculate body width from shoulder keypoints (in normalized coords)
export const getBodyWidth = (kp) => {
  const ls = kp?.find(k => k.name === 'left_shoulder')
  const rs = kp?.find(k => k.name === 'right_shoulder')
  if (!ls || !rs) return 0.3

  return Math.abs(rs.x - ls.x)
}

// Calculate body height from shoulder to hip
export const getBodyHeight = (kp) => {
  const ls = kp?.find(k => k.name === 'left_shoulder')
  const lh = kp?.find(k => k.name === 'left_hip')
  if (!ls || !lh) return 0.35

  return Math.abs(lh.y - ls.y)
}

// Calculate shoulder-to-shoulder center
export const getShoulderCenter = (kp, cw, ch) => {
  const ls = kp?.find(k => k.name === 'left_shoulder')
  const rs = kp?.find(k => k.name === 'right_shoulder')
  if (!ls || !rs) return { x: cw / 2, y: ch / 3 }

  return {
    x: ((1 - (ls.x + rs.x) / 2) * cw),
    y: ((ls.y + rs.y) / 2 * ch)
  }
}

// Calculate hip center for lower body products
export const getHipCenter = (kp, cw, ch) => {
  const lh = kp?.find(k => k.name === 'left_hip')
  const rh = kp?.find(k => k.name === 'right_hip')
  if (!lh || !rh) return { x: cw / 2, y: ch / 2 }

  return {
    x: ((1 - (lh.x + rh.x) / 2) * cw),
    y: ((lh.y + rh.y) / 2 * ch)
  }
}

// Smooth value over time using exponential moving average
export const smoothValue = (newVal, prevVal, alpha = 0.3) => {
  if (prevVal === null || prevVal === undefined) return newVal
  return prevVal + alpha * (newVal - prevVal)
}

// Convert rotation to canvas transform matrix
export const getCanvasTransform = (rotation, centerX, centerY) => {
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return { cos, sin, centerX, centerY }
}

// Apply perspective skew based on body angle
export const getPerspectiveSkew = (bodyRotation, torsoTilt) => {
  // Horizontal skew from shoulder rotation
  const skewX = (bodyRotation / 45) * 0.15 // Max ±0.15 skew
  // Vertical skew from torso tilt
  const skewY = (torsoTilt / 45) * 0.1
  return { skewX, skewY }
}

// Calculate dynamic opacity based on body confidence
export const getDynamicOpacity = (kp, baseOpacity = 0.88) => {
  const confidences = kp?.map(k => k.score) || []
  const avgConfidence = confidences.length > 0
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length
    : 0.5

  // Higher confidence = full opacity, lower = more transparent
  return baseOpacity * (0.6 + 0.4 * avgConfidence)
}

export default {
  getBodyRotation,
  getTorsoTilt,
  getBodyWidth,
  getBodyHeight,
  getShoulderCenter,
  getHipCenter,
  smoothValue,
  getCanvasTransform,
  getPerspectiveSkew,
  getDynamicOpacity
}
