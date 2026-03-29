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
    let hipsVisible = LH && RH &&
      (LH.visibility ?? 1) > visThr && (RH.visibility ?? 1) > visThr

    let eLeftHip  = LH
    let eRightHip = RH

    // Estimate hips from shoulders when hips not in frame
    if (shouldersVisible && !hipsVisible) {
      const sw = Math.abs(LS.x - RS.x)
      const estimatedTorsoH = sw * 1.3
      const mz = (LS.z + RS.z) / 2
      eLeftHip  = { x: LS.x, y: LS.y + estimatedTorsoH, z: mz, visibility: 0.3 }
      eRightHip = { x: RS.x, y: RS.y + estimatedTorsoH, z: mz, visibility: 0.3 }
      hipsVisible = true
    }

    const hasUsable = shouldersVisible && hipsVisible

    if (!hasUsable) {
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
    this.lastValidLandmarks = { LS, RS, LH: eLeftHip, RH: eRightHip }

    // ── Position: torso center ──
    const shoulderMidX = (LS.x + RS.x) / 2
    const shoulderMidY = (LS.y + RS.y) / 2
    const hipMidY      = (eLeftHip.y + eRightHip.y) / 1.8
    const torsoCenterY = (shoulderMidY + hipMidY) / 2 - 0.05
    const zOff         = (LS.z + RS.z) / 2

    // DEBUG: Log BEFORE projection
    const beforeProjection = { x: shoulderMidX, y: torsoCenterY, z: zOff }

    this.targetPosition.set(shoulderMidX, torsoCenterY, zOff)
    this._projectToWorld(this.targetPosition, camera)
    
    // DEBUG: Log AFTER projection
    if (Math.random() < 0.05) {
      console.log(`[VtoPoseEngine] BEFORE project: x=${beforeProjection.x.toFixed(3)}, y=${beforeProjection.y.toFixed(3)}, z=${beforeProjection.z.toFixed(3)}`)
      console.log(`[VtoPoseEngine] AFTER  project: x=${this.targetPosition.x.toFixed(3)}, y=${this.targetPosition.y.toFixed(3)}, z=${this.targetPosition.z.toFixed(3)}`)
      console.log(`[VtoPoseEngine] Camera frustum: L=${camera.left.toFixed(2)} R=${camera.right.toFixed(2)} T=${camera.top.toFixed(2)} B=${camera.bottom.toFixed(2)}`)
    }

    // ── Scale: torso height drives garment size ──
    this.shoulderMidpoint.set(shoulderMidX, shoulderMidY, zOff)
    this.hipMidpoint.set(
      (eLeftHip.x + eRightHip.x) / 2,
      hipMidY,
      (eLeftHip.z + eRightHip.z) / 2,
    )
    const torsoH = this.shoulderMidpoint.distanceTo(this.hipMidpoint)
    const RATIO  = this.isMobile ? 1.8 : 2.7
    const targetScaleVal = Math.max(0.5, Math.min(2.0, torsoH * RATIO))

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

    // DEBUG: Log FINAL applied transform
    if (Math.random() < 0.05) {
      console.log(`[VtoPoseEngine] FINAL applied: pos=(${this.currentPosition.x.toFixed(3)}, ${this.currentPosition.y.toFixed(3)}, ${this.currentPosition.z.toFixed(3)}) scale=${this.currentScale.x.toFixed(3)}`)
    }

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
      // Store original values for debugging
      const origX = vector.x
      const origY = vector.y
      const origZ = vector.z
      
      // Map normalized [0,1] DIRECTLY to camera frustum bounds (NO extra scale)
      // MediaPipe: Y is 0 at top, 1 at bottom
      // Three.js: Y is +top at top, -1 at bottom
      
      const frustumWidth  = camera.right - camera.left      // e.g., 3.56
      const frustumHeight = camera.top - camera.bottom       // e.g., 2.00
      
      // Convert normalized coords to frustum space
      vector.x = (vector.x - 0.5) * frustumWidth            // scaled to [-frustumWidth/2, +frustumWidth/2]
      vector.y = -(vector.y - 0.5) * frustumHeight          // flip Y and scale to frustum
      vector.z = 0.5
      
      if (Math.random() < 0.02) {
        console.log(`[VtoPoseEngine._projectToWorld] In normalized: (${origX.toFixed(3)}, ${origY.toFixed(3)}, ${origZ.toFixed(3)})`)
        console.log(`[VtoPoseEngine._projectToWorld] Out world: (${vector.x.toFixed(3)}, ${vector.y.toFixed(3)}, ${vector.z.toFixed(3)})`)
        console.log(`[VtoPoseEngine._projectToWorld] Frustum W=${frustumWidth.toFixed(3)} H=${frustumHeight.toFixed(3)} → Y should be in [-1, +1]`)
      }
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
