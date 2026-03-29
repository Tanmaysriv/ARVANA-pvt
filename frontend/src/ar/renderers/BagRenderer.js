/**
 * BagRenderer.js — v2
 * Tote bag hanging from wrist. Geometry in XY plane facing camera.
 * Physics-based sway when hand moves.
 */

import * as THREE from 'three'

export class BagRenderer {
  constructor(scene, color = '#2c1810') {
    this.scene = scene
    this.bagGroup = null
    this.handleGroup = null
    this.targetColor = color
    this._swayAngle = 0
    this._swayVelocity = 0
    this._createModel(color)
  }

  _createModel(color) {
    if (this.bagGroup) {
      this.scene.remove(this.bagGroup)
      this.bagGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
    }

    const group = new THREE.Group()
    const hex = this._resolveColor(color)

    const mainMat = new THREE.MeshPhysicalMaterial({
      color: hex, roughness: 0.75, metalness: 0.0,
      clearcoat: 0.15, clearcoatRoughness: 0.6,
    })
    const accentMat = new THREE.MeshStandardMaterial({
      color: this._lighten(hex, 0.12), roughness: 0.65, metalness: 0.0,
    })
    const pipeMat = new THREE.MeshStandardMaterial({
      color: this._darken(hex, 0.12), roughness: 0.85,
    })
    const hardwareMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4a947, roughness: 0.08, metalness: 1.0,
    })

    // ── BAG BODY (pivot at top, hangs downward) ──
    // Everything in XY plane, thin in Z (depth)
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.0, 0.38)
    bodyGeo.translate(0, -0.5, 0)   // pivot at top center
    const body = new THREE.Mesh(bodyGeo, mainMat)
    group.add(body)

    // ── FLAP (top flap) ──
    const flapGeo = new THREE.BoxGeometry(1.2, 0.32, 0.40)
    flapGeo.translate(0, 0.16, 0)
    const flap = new THREE.Mesh(flapGeo, accentMat)
    group.add(flap)

    // ── PIPING EDGES ──
    // Bottom edge
    const btmGeo = new THREE.BoxGeometry(1.22, 0.05, 0.40)
    const btm = new THREE.Mesh(btmGeo, pipeMat)
    btm.position.y = -1.0
    group.add(btm)

    // Side edges
    for (const sx of [-0.61, 0.61]) {
      const sg = new THREE.BoxGeometry(0.05, 1.02, 0.40)
      const s = new THREE.Mesh(sg, pipeMat)
      s.position.set(sx, -0.5, 0)
      group.add(s)
    }

    // ── CLASP (gold disk facing camera) ──
    const claspGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16)
    const clasp = new THREE.Mesh(claspGeo, hardwareMat)
    clasp.position.set(0, -0.02, 0.22)
    clasp.rotation.x = Math.PI / 2   // cylinder axis along Z (dot facing camera) ✓
    group.add(clasp)

    // ── STITCHING LINE ──
    const stitchMat = new THREE.LineBasicMaterial({ color: this._lighten(hex, 0.28) })
    const stitchGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.42, -0.28, 0.20),
      new THREE.Vector3( 0.42, -0.28, 0.20),
    ])
    group.add(new THREE.Line(stitchGeo, stitchMat))

    // ── HANDLE (arc curve above the bag) ──
    const hCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.32, 0.0, 0),
      new THREE.Vector3(0, 0.55, 0),
      new THREE.Vector3(0.32, 0.0, 0),
    )
    const hGeo = new THREE.TubeGeometry(hCurve, 24, 0.04, 8, false)
    const handle = new THREE.Mesh(hGeo, hardwareMat)
    group.add(handle)

    // ── HANDLE RINGS (torus rings connecting handle to bag body) ──
    // Torus default is in XY plane (axis along Z) — correct for face-on view
    for (const x of [-0.32, 0.32]) {
      const rGeo = new THREE.TorusGeometry(0.055, 0.018, 8, 16)
      const ring = new THREE.Mesh(rGeo, hardwareMat)
      ring.position.set(x, 0.02, 0)
      // NO rotation — torus in XY plane, hole along Z, visible as circle from camera ✓
      group.add(ring)
    }

    this.scene.add(group)
    this.bagGroup = group
  }

  applyTransform(transform, dt = 0.016) {
    if (!this.bagGroup || !transform) { this.setVisible(false); return }
    this.setVisible(true)

    // Spring-damper sway
    const stiffness = 10, damping = 5
    this._swayVelocity += -stiffness * this._swayAngle * dt
    this._swayVelocity *= (1 - damping * dt)
    this._swayAngle    += this._swayVelocity * dt
    this._swayAngle     = Math.max(-0.18, Math.min(0.18, this._swayAngle))

    this.bagGroup.position.copy(transform.position)
    this.bagGroup.scale.copy(transform.scale)
    this.bagGroup.rotation.set(0, 0, this._swayAngle)
  }

  addImpulse(v = 0.25) { this._swayVelocity += v }

  setColor(color) {
    if (color === this.targetColor) return
    this.targetColor = color
    this._createModel(color)
  }
  setVisible(v) { if (this.bagGroup) this.bagGroup.visible = v }

  _resolveColor(c) {
    if (!c) return 0x2c1810
    if (typeof c === 'number') return c
    const m = { black:'#1a1a1a', brown:'#5c3a1e', tan:'#c9996b', beige:'#d6c4a0',
      red:'#8b1a1a', navy:'#0d1b3e', white:'#f5f5f5', gray:'#5a5a5a',
      camel:'#c19a6b', cream:'#f5f0e8', 'dark green':'#1a3d2b' }
    return parseInt((m[c.trim().toLowerCase()] || c).replace('#',''), 16)
  }
  _lighten(h, a) {
    return ((Math.min(255,((h>>16)&0xff)+a*255)|0)<<16)|((Math.min(255,((h>>8)&0xff)+a*255)|0)<<8)|(Math.min(255,(h&0xff)+a*255)|0)
  }
  _darken(h, a) {
    return ((Math.max(0,((h>>16)&0xff)-a*255)|0)<<16)|((Math.max(0,((h>>8)&0xff)-a*255)|0)<<8)|(Math.max(0,(h&0xff)-a*255)|0)
  }

  dispose() {
    if (this.bagGroup) {
      this.scene.remove(this.bagGroup)
      this.bagGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
      this.bagGroup = null
    }
  }
}
