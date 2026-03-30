/**
 * WatchRenderer.js — v3 (correct geometry orientations)
 *
 * Geometry coordinate system:
 *  - Watch face in the XY plane, facing +Z (toward camera)
 *  - Straps extend along +Y (top) and -Y (bottom) in local space
 *  - Crown sticks out in +X direction
 *  - The transform.rotation.z aligns the strap with the wrist angle
 */

import * as THREE from 'three'

export class WatchRenderer {
  constructor(scene, color = '#1a1a1a') {
    this.scene = scene
    this.watchGroup = null
    this.hourHandMesh = null
    this.minHandMesh = null
    this.secHand = null
    this.targetColor = color
    this._createModel(color)
  }

  _createModel(color) {
    if (this.watchGroup) {
      this.scene.remove(this.watchGroup)
      this.watchGroup.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) o.material.dispose()
      })
    }

    const group = new THREE.Group()
    const hex = this._resolveColor(color)

    // ── Materials ──
    const caseMat = new THREE.MeshPhysicalMaterial({
      color: hex, roughness: 0.2, metalness: 0.95,
      reflectivity: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1,
    })
    const bezelMat = new THREE.MeshPhysicalMaterial({
      color: this._lighten(hex, 0.25), roughness: 0.1, metalness: 1.0,
    })
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xaadcff, roughness: 0.02, metalness: 0.0,
      transmission: 0.85, transparent: true, opacity: 0.3,
    })
    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x08080f, roughness: 0.8, metalness: 0.1,
    })
    const handMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.1, metalness: 0.2,
    })
    const secMat = new THREE.MeshStandardMaterial({
      color: 0xff4040, roughness: 0.2, metalness: 0.1,
    })
    const strapMat = new THREE.MeshStandardMaterial({
      color: this._darken(hex, 0.2), roughness: 0.85, metalness: 0.0,
    })
    const hardwareMat = new THREE.MeshPhysicalMaterial({
      color: this._lighten(hex, 0.35), roughness: 0.08, metalness: 1.0,
    })
    const tickMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc, roughness: 0.3, metalness: 0.4,
    })

    // ── CASE (cylinder with axis along Z → flat face faces camera) ──
    const caseGeo = new THREE.CylinderGeometry(0.48, 0.46, 0.12, 48)
    const caseMesh = new THREE.Mesh(caseGeo, caseMat)
    caseMesh.rotation.x = Math.PI / 2    // axis now along Z, face toward +Z ✓
    group.add(caseMesh)

    // ── BEZEL (torus ring visible from front — stays in XY plane, NO rotation) ──
    const bezelGeo = new THREE.TorusGeometry(0.49, 0.055, 16, 64)
    const bezel = new THREE.Mesh(bezelGeo, bezelMat)
    // Default TorusGeometry is in XY plane with axis along Z — exactly what we need
    bezel.position.z = 0.04   // sit slightly in front of case
    group.add(bezel)

    // ── DIAL (face circle in XY plane) ──
    const dialGeo = new THREE.CircleGeometry(0.42, 48)
    const dial = new THREE.Mesh(dialGeo, dialMat)
    dial.position.z = 0.067   // front of case
    group.add(dial)

    // ── HOUR MARKERS (12 ticks at z=0.075, rotated in XY plane) ──
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const r = 0.34
      const isQuarter = i % 3 === 0
      const w = isQuarter ? 0.05 : 0.025
      const h = isQuarter ? 0.10 : 0.06
      const tickGeo = new THREE.BoxGeometry(w, h, 0.005)
      const tick = new THREE.Mesh(tickGeo, tickMat)
      tick.position.set(Math.sin(angle) * r, Math.cos(angle) * r, 0.075)
      tick.rotation.z = -angle
      group.add(tick)
    }

    // ── HOUR HAND (thin box in XY plane, rotated via rotation.z) ──
    const hourHandGeo = new THREE.BoxGeometry(0.04, 0.22, 0.008)
    hourHandGeo.translate(0, 0.09, 0)   // pivot at bottom
    this.hourHandMesh = new THREE.Mesh(hourHandGeo, handMat)
    this.hourHandMesh.position.z = 0.082
    group.add(this.hourHandMesh)

    // ── MINUTE HAND ──
    const minHandGeo = new THREE.BoxGeometry(0.03, 0.32, 0.008)
    minHandGeo.translate(0, 0.13, 0)
    this.minHandMesh = new THREE.Mesh(minHandGeo, handMat)
    this.minHandMesh.position.z = 0.09
    group.add(this.minHandMesh)

    // ── SECONDS HAND (red, thin) ──
    const secGeo = new THREE.BoxGeometry(0.012, 0.38, 0.006)
    secGeo.translate(0, 0.10, 0)
    this.secHand = new THREE.Mesh(secGeo, secMat)
    this.secHand.position.z = 0.1
    group.add(this.secHand)

    // ── CENTER CAP ──
    const capGeo = new THREE.CircleGeometry(0.025, 12)
    const cap = new THREE.Mesh(capGeo, hardwareMat)
    cap.position.z = 0.11
    group.add(cap)

    // ── GLASS (thin cylinder: rotation.x = π/2 to face camera) ──
    const glassGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.008, 48)
    const glass = new THREE.Mesh(glassGeo, glassMat)
    glass.rotation.x = Math.PI / 2
    glass.position.z = 0.075
    group.add(glass)

    // ── STRAPS (boxes extending in Y — NO rotation needed) ──
    // Top strap
    const strapTopGeo = new THREE.BoxGeometry(0.52, 0.40, 0.06)
    const strapTop = new THREE.Mesh(strapTopGeo, strapMat)
    strapTop.position.set(0, 0.57, -0.02)    // y=+0.57, slightly behind case
    group.add(strapTop)

    // Top taper
    const taperTopGeo = new THREE.BoxGeometry(0.52, 0.10, 0.07)
    const taperTop = new THREE.Mesh(taperTopGeo, strapMat)
    taperTop.position.set(0, 0.34, -0.015)
    group.add(taperTop)

    // Bottom strap
    const strapBotGeo = new THREE.BoxGeometry(0.49, 0.34, 0.06)
    const strapBot = new THREE.Mesh(strapBotGeo, strapMat)
    strapBot.position.set(0, -0.50, -0.02)
    group.add(strapBot)

    // Bottom taper
    const taperBotGeo = new THREE.BoxGeometry(0.49, 0.10, 0.07)
    const taperBot = new THREE.Mesh(taperBotGeo, strapMat)
    taperBot.position.set(0, -0.31, -0.015)
    group.add(taperBot)

    // Buckle holes
    const holesMat = new THREE.MeshStandardMaterial({ color: 0x030303, roughness: 1 })
    for (let i = 0; i < 3; i++) {
      const holeGeo = new THREE.CircleGeometry(0.018, 8)
      const hole = new THREE.Mesh(holeGeo, holesMat)
      hole.position.set(0, -0.38 - i * 0.06, -0.02 + 0.032)
      group.add(hole)
    }

    // ── CROWN (cylinder pointing in +X — rotation.z = π/2) ──
    const crownGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.16, 14)
    const crown = new THREE.Mesh(crownGeo, hardwareMat)
    crown.position.set(0.52, 0.06, 0)
    crown.rotation.z = Math.PI / 2   // axis along X ✓
    group.add(crown)

    // Pusher buttons
    for (const y of [0.20, -0.06]) {
      const pusherGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.09, 10)
      const pusher = new THREE.Mesh(pusherGeo, bezelMat)
      pusher.position.set(0.50, y, 0)
      pusher.rotation.z = Math.PI / 2
      group.add(pusher)
    }

    this.scene.add(group)
    this.watchGroup = group
  }

  applyTransform(transform) {
    if (!this.watchGroup || !transform) { 
      if (!this.watchGroup) console.warn(`[WatchRenderer] ⚠️ No watchGroup!`)
      if (!transform) console.warn(`[WatchRenderer] ⚠️ No transform!`)
      this.setVisible(false); 
      return 
    }
    this.setVisible(true)

    // Real-time clock hands
    const now = new Date()
    const sec = now.getSeconds() + now.getMilliseconds() / 1000
    const min = now.getMinutes() + sec / 60
    const hour = (now.getHours() % 12) + min / 60
    if (this.secHand)      this.secHand.rotation.z      = -(sec  / 60) * Math.PI * 2
    if (this.minHandMesh)  this.minHandMesh.rotation.z  = -(min  / 60) * Math.PI * 2
    if (this.hourHandMesh) this.hourHandMesh.rotation.z = -(hour / 12) * Math.PI * 2

    this.watchGroup.position.copy(transform.position)
    this.watchGroup.rotation.copy(transform.rotation)
    this.watchGroup.scale.copy(transform.scale)
  }

  setColor(color) {
    if (color === this.targetColor) return
    this.targetColor = color
    this._createModel(color)
  }

  setVisible(v) { if (this.watchGroup) this.watchGroup.visible = v }

  _resolveColor(color) {
    if (!color) return 0x1a1a1a
    if (typeof color === 'number') return color
    const map = {
      black: '#1c1c1e', white: '#e8e8e8', silver: '#a8aaad',
      gold: '#c9a84c', 'rose gold': '#b76e79', navy: '#1a2a4a',
      brown: '#4a2e1a', blue: '#1a3a6b', red: '#8b1a1a',
      gray: '#505050', green: '#1a3d2b',
    }
    const hex = map[color.trim().toLowerCase()] || color
    return parseInt(hex.replace('#', ''), 16)
  }
  _lighten(hex, a) {
    return ((Math.min(255, ((hex >> 16) & 0xff) + a * 255) | 0) << 16) |
           ((Math.min(255, ((hex >> 8)  & 0xff) + a * 255) | 0) << 8)  |
           (Math.min(255,  (hex         & 0xff)  + a * 255) | 0)
  }
  _darken(hex, a) {
    return ((Math.max(0, ((hex >> 16) & 0xff) - a * 255) | 0) << 16) |
           ((Math.max(0, ((hex >> 8)  & 0xff) - a * 255) | 0) << 8)  |
           (Math.max(0,  (hex         & 0xff)  - a * 255) | 0)
  }

  dispose() {
    if (this.watchGroup) {
      this.scene.remove(this.watchGroup)
      this.watchGroup.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) o.material.dispose()
      })
      this.watchGroup = null
    }
  }
}
