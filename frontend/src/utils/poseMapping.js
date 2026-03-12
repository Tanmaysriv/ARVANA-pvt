// Pose keypoint mapping utility for BlazePose
export const POSE_KEYPOINTS = {
  nose: 0,
  left_eye: 1,
  right_eye: 2,
  left_ear: 3,
  right_ear: 4,
  left_shoulder: 5,
  right_shoulder: 6,
  left_elbow: 7,
  right_elbow: 8,
  left_wrist: 9,
  right_wrist: 10,
  left_hip: 11,
  right_hip: 12,
  left_knee: 13,
  right_knee: 14,
  left_ankle: 15,
  right_ankle: 16
}

export const getKeypointByName = (keypoints, name) => {
  if (!keypoints || !Array.isArray(keypoints)) return null
  const index = POSE_KEYPOINTS[name]
  return keypoints[index] || null
}

export const normalizeKeypoints = (keypoints, videoWidth, videoHeight) => {
  if (!keypoints) return []

  return keypoints.map(keypoint => ({
    name: keypoint.name,
    x: keypoint.x / videoWidth, // Normalize to 0-1
    y: keypoint.y / videoHeight,
    z: keypoint.z || 0,
    score: keypoint.score || 0
  }))
}