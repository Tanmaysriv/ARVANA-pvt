/**
 * SMPLXBoneMapper.js — ported from softwear (TechAngelX/softwear)
 *
 * Drives the garment skeleton bones using MediaPipe pose landmarks.
 * Maps shoulder/elbow/wrist landmarks to bone rotations in the GLB armature.
 * This makes the garment's sleeves follow arm movements realistically.
 */

import * as THREE from 'three'

const MP = {
  LEFT_SHOULDER:  11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW:     13,
  RIGHT_ELBOW:    14,
  LEFT_WRIST:     15,
  RIGHT_WRIST:    16,
  LEFT_HIP:       23,
  RIGHT_HIP:      24,
}

export class SMPLXBoneMapper {
  constructor(isMobile = false) {
    this.initialized       = false
    this.boneMap           = {}
    this.skeleton          = null
    this.lastBoneQuats     = {}
    this.lastUpdateTime    = 0
    this.visThr            = isMobile ? 0.1 : 0.45
    this.slerpAmount       = 0.3
    this.shoulderWidthMult = 1.75
    this.downThreshold     = -0.85

    // Default bind vectors (T-pose)
    this.bindVectors = {
      leftArm:      new THREE.Vector3(1,  0, 0),
      rightArm:     new THREE.Vector3(-1, 0, 0),
      leftForearm:  new THREE.Vector3(1,  0, 0),
      rightForearm: new THREE.Vector3(-1, 0, 0),
      spine:        new THREE.Vector3(0,  1, 0),
    }
  }

  /**
   * Find and cache all skeleton bones in the loaded GLB model.
   * Run once after GLTF loads.
   */
  initBones(model) {
    this.boneMap  = {}
    this.skeleton = null
    this.lastBoneQuats = {}

    model.traverse(obj => {
      if (obj.isSkinnedMesh && obj.skeleton) {
        this.skeleton = obj.skeleton
        obj.skeleton.bones.forEach(bone => {
          if (bone.name) this.boneMap[bone.name] = bone
        })
      }
    })

    this.initialized = Object.keys(this.boneMap).length > 0
  }

  /**
   * Apply pose landmarks to bones each frame.
   * @param {Object} model      - THREE.Group (the garment GLB scene)
   * @param {Array}  landmarks  - MediaPipe poseLandmarks
   * @param {number} timestamp  - performance.now() or Date.now()
   */
  applyPose(model, landmarks, timestamp) {
    if (!this.initialized || !landmarks || !model) return
    if (timestamp - this.lastUpdateTime < 33) return   // ~30 fps max
    this.lastUpdateTime = timestamp

    // Check required landmarks present
    const required = [MP.LEFT_SHOULDER, MP.RIGHT_SHOULDER, MP.LEFT_ELBOW, MP.RIGHT_ELBOW, MP.LEFT_WRIST, MP.RIGHT_WRIST]
    if (required.some(i => !landmarks[i])) return

    const LS = landmarks[MP.LEFT_SHOULDER]
    const RS = landmarks[MP.RIGHT_SHOULDER]
    const shoulderCX = (LS.x + RS.x) / 2

    // Convert landmark to normalised 3D space
    const toLandmark3D = (idx) => {
      const lm = landmarks[idx]
      if (!lm || (lm.visibility ?? 1) < this.visThr) return new THREE.Vector3()
      let x = lm.x
      // Mirror left-side landmarks outward (shoulder width exaggeration)
      if ([11, 13, 15].includes(idx)) x = shoulderCX - (shoulderCX - x) * this.shoulderWidthMult
      else if ([12, 14, 16].includes(idx)) x = shoulderCX + (x - shoulderCX) * this.shoulderWidthMult
      return new THREE.Vector3((x - 0.5) * 2, -(lm.y - 0.5) * 2, -(lm.z ?? 0) * 2)
    }

    const lShoulder = toLandmark3D(MP.LEFT_SHOULDER)
    const rShoulder = toLandmark3D(MP.RIGHT_SHOULDER)
    const lElbow    = toLandmark3D(MP.LEFT_ELBOW)
    const rElbow    = toLandmark3D(MP.RIGHT_ELBOW)
    const lWrist    = toLandmark3D(MP.LEFT_WRIST)
    const rWrist    = toLandmark3D(MP.RIGHT_WRIST)
    const lHip      = toLandmark3D(MP.LEFT_HIP)
    const rHip      = toLandmark3D(MP.RIGHT_HIP)

    // ── SPINE rotation ──
    const sMid = new THREE.Vector3().addVectors(lShoulder, rShoulder).multiplyScalar(0.5)
    const hMid = new THREE.Vector3().addVectors(lHip, rHip).multiplyScalar(0.5)
    const spineRot = this._boneRotation(hMid, sMid, this.bindVectors.spine)

    ;['spine1', 'spine2', 'spine3'].forEach((name, i) => {
      if (this.boneMap[name]) {
        const partial = new THREE.Quaternion().slerp(spineRot, (i + 1) / 3 * 0.5)
        this.boneMap[name].quaternion.copy(partial)
      }
    })

    // ── ARM and FOREARM rotations ──
    const lArmVec = new THREE.Vector3().subVectors(lWrist, lShoulder).normalize()
    const rArmVec = new THREE.Vector3().subVectors(rWrist, rShoulder).normalize()
    const lArmDown = lArmVec.y < this.downThreshold
    const rArmDown = rArmVec.y < this.downThreshold

    const armBones = {
      'left_shoulder':  { p1: lShoulder, p2: lElbow,  bind: this.bindVectors.leftArm,      skip: lArmDown },
      'right_shoulder': { p1: rShoulder, p2: rElbow,  bind: this.bindVectors.rightArm,     skip: rArmDown },
      'left_elbow':     { p1: lElbow,    p2: lWrist,  bind: this.bindVectors.leftForearm,  skip: lArmDown },
      'right_elbow':    { p1: rElbow,    p2: rWrist,  bind: this.bindVectors.rightForearm, skip: rArmDown },
    }

    for (const [boneName, { p1, p2, bind, skip }] of Object.entries(armBones)) {
      if (!this.boneMap[boneName] || skip) continue
      const targetQ = this._boneRotation(p1, p2, bind)
      const lastQ   = this.lastBoneQuats[boneName] || this.boneMap[boneName].quaternion.clone()
      lastQ.slerp(targetQ, this.slerpAmount)
      this.boneMap[boneName].quaternion.copy(lastQ)
      this.lastBoneQuats[boneName] = lastQ.clone()
    }
  }

  _boneRotation(p1, p2, bindVec) {
    const dir = new THREE.Vector3().subVectors(p2, p1)
    if (dir.lengthSq() < 0.0001) return new THREE.Quaternion()
    return new THREE.Quaternion().setFromUnitVectors(bindVec, dir.normalize())
  }
}
