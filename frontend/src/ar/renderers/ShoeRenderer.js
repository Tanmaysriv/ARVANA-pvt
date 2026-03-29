/**
 * ShoeRenderer.js — Premium v2
 * Detailed procedural sneaker with:
 *  - PBR materials with clearcoat for patent/leather look
 *  - Midsole, outsole, upper, tongue, laces, heel counter, swoosh
 *  - Supports left/right foot mirroring
 */

import * as THREE from 'three'

export class ShoeRenderer {
  constructor(scene, color = '#1a1a1a', side = 'right') {
    this.scene = scene
    this.shoeGroup = null
    this.targetColor = color
    this.side = side
    this._createModel(color)
  }

  _createModel(color) {
    if (this.shoeGroup) {
      this.scene.remove(this.shoeGroup)
      this.shoeGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
    }

    const group = new THREE.Group()
    const hex = this._resolveColor(color)
    const mirror = this.side === 'left' ? -1 : 1

    // ── Materials ──
    const upperMat = new THREE.MeshPhysicalMaterial({
      color: hex, roughness: 0.6, metalness: 0.0,
      clearcoat: 0.25, clearcoatRoughness: 0.4,
    })
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f0, roughness: 0.9, metalness: 0.0,
    })
    const outsoleGripMat = new THREE.MeshStandardMaterial({
      color: 0x222222, roughness: 0.95, metalness: 0.0,
    })
    const accentMat = new THREE.MeshPhysicalMaterial({
      color: this._lighten(hex, 0.3), roughness: 0.3, metalness: 0.1,
      clearcoat: 0.6,
    })
    const laceMat = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8, roughness: 0.95, metalness: 0.0,
    })
    const insideMat = new THREE.MeshStandardMaterial({
      color: this._darken(hex, 0.35), roughness: 0.85, metalness: 0.0,
    })

    // ── OUTSOLE (bottom rubber) ──
    const outsoleGeo = new THREE.BoxGeometry(1.3, 0.06, 0.48)
    outsoleGeo.translate(0, -0.03, 0)
    const outsole = new THREE.Mesh(outsoleGeo, outsoleGripMat)
    group.add(outsole)

    // ── MIDSOLE (cushioning layer) ──
    const midsoleGeo = new THREE.BoxGeometry(1.35, 0.14, 0.52)
    midsoleGeo.translate(0, 0.07, 0)
    const midsole = new THREE.Mesh(midsoleGeo, soleMat)
    group.add(midsole)

    // Midsole front toe curve
    const toeCurveGeo = new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI, 0, Math.PI / 2)
    const toeCurve = new THREE.Mesh(toeCurveGeo, soleMat)
    toeCurve.position.set(0.65, 0.14, 0)
    toeCurve.rotation.z = -Math.PI / 2
    group.add(toeCurve)

    // ── UPPER (shoe body) ──
    const upperGeo = new THREE.BoxGeometry(1.15, 0.32, 0.48)
    upperGeo.translate(-0.05, 0.30, 0)
    const upper = new THREE.Mesh(upperGeo, upperMat)
    group.add(upper)

    // Toe box (rounded front)
    const toeGeo = new THREE.SphereGeometry(0.26, 16, 16)
    const toe = new THREE.Mesh(toeGeo, upperMat)
    toe.position.set(0.52, 0.26, 0)
    toe.scale.set(1, 0.65, 0.92)
    group.add(toe)

    // ── HEEL COUNTER ──
    const heelGeo = new THREE.BoxGeometry(0.22, 0.38, 0.50)
    heelGeo.translate(-0.56, 0.33, 0)
    const heel = new THREE.Mesh(heelGeo, upperMat)
    group.add(heel)

    // Heel pull tab
    const pullTabGeo = new THREE.BoxGeometry(0.06, 0.14, 0.2)
    const pullTab = new THREE.Mesh(pullTabGeo, accentMat)
    pullTab.position.set(-0.65, 0.48, 0)
    group.add(pullTab)

    // ── TONGUE ──
    const tongueGeo = new THREE.BoxGeometry(0.25, 0.22, 0.3)
    const tongue = new THREE.Mesh(tongueGeo, insideMat)
    tongue.position.set(0.0, 0.52, 0)
    tongue.rotation.z = 0.15
    group.add(tongue)

    // ── COLLAR (ankle opening) ──
    const collarGeo = new THREE.TorusGeometry(0.22, 0.05, 8, 24, Math.PI)
    const collar = new THREE.Mesh(collarGeo, insideMat)
    collar.position.set(-0.18, 0.46, 0)
    collar.rotation.z = Math.PI / 2
    collar.rotation.x = Math.PI / 2
    group.add(collar)

    // ── LACES ──
    for (let i = 0; i < 4; i++) {
      const x = -0.05 + i * 0.12
      const laceGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6)
      const lace = new THREE.Mesh(laceGeo, laceMat)
      lace.position.set(x, 0.46, 0)
      lace.rotation.z = Math.PI / 2
      group.add(lace)
    }

    // ── SWOOSH / LOGO (accent stripe) ──
    const swooshPoints = [
      new THREE.Vector3(-0.45, 0.20, 0.25 * mirror),
      new THREE.Vector3(-0.15, 0.30, 0.25 * mirror),
      new THREE.Vector3(0.15, 0.40, 0.25 * mirror),
      new THREE.Vector3(0.35, 0.35, 0.25 * mirror),
    ]
    const swooshCurve = new THREE.CatmullRomCurve3(swooshPoints)
    const swooshGeo = new THREE.TubeGeometry(swooshCurve, 20, 0.025, 6, false)
    const swoosh = new THREE.Mesh(swooshGeo, accentMat)
    group.add(swoosh)

    // Mirror swoosh on other side
    const swooshPointsOther = swooshPoints.map(p => new THREE.Vector3(p.x, p.y, -p.z))
    const swooshCurveOther = new THREE.CatmullRomCurve3(swooshPointsOther)
    const swooshGeoOther = new THREE.TubeGeometry(swooshCurveOther, 20, 0.025, 6, false)
    const swooshOther = new THREE.Mesh(swooshGeoOther, accentMat)
    group.add(swooshOther)

    // ── Sole tread pattern ──
    for (let i = 0; i < 8; i++) {
      const treadGeo = new THREE.BoxGeometry(0.12, 0.01, 0.42)
      const tread = new THREE.Mesh(treadGeo, outsoleGripMat)
      tread.position.set(-0.4 + i * 0.12, -0.06, 0)
      group.add(tread)
    }

    // Mirror for left foot
    if (this.side === 'left') {
      group.scale.x = -1
    }

    this.scene.add(group)
    this.shoeGroup = group
  }

  applyTransform(transform) {
    if (!this.shoeGroup || !transform) { this.setVisible(false); return }
    this.setVisible(true)
    this.shoeGroup.position.copy(transform.position)
    this.shoeGroup.rotation.copy(transform.rotation)
    this.shoeGroup.scale.copy(transform.scale)
    if (this.side === 'left') this.shoeGroup.scale.x *= -1
  }

  setColor(color) {
    if (color === this.targetColor) return
    this.targetColor = color
    this._createModel(color)
  }

  setVisible(v) { if (this.shoeGroup) this.shoeGroup.visible = v }

  _resolveColor(color) {
    if (!color) return 0x1a1a1a
    if (typeof color === 'number') return color
    const map = {
      black: '#1c1c1e', white: '#f0f0f0', red: '#b91c1c', blue: '#1e40af',
      navy: '#1e2a5e', gray: '#6b7280', brown: '#5c3a1e', tan: '#c9996b',
      green: '#166534', yellow: '#ca8a04', orange: '#c2410c', pink: '#db2777',
      purple: '#7e22ce',
    }
    const hex = map[color.trim().toLowerCase()] || color
    return parseInt(hex.replace('#', ''), 16)
  }
  _lighten(hex, a) {
    return ((Math.min(255, ((hex >> 16) & 0xff) + a * 255) | 0) << 16) |
           ((Math.min(255, ((hex >> 8) & 0xff) + a * 255) | 0) << 8) |
           (Math.min(255, (hex & 0xff) + a * 255) | 0)
  }
  _darken(hex, a) {
    return ((Math.max(0, ((hex >> 16) & 0xff) - a * 255) | 0) << 16) |
           ((Math.max(0, ((hex >> 8) & 0xff) - a * 255) | 0) << 8) |
           (Math.max(0, (hex & 0xff) - a * 255) | 0)
  }

  dispose() {
    if (this.shoeGroup) {
      this.scene.remove(this.shoeGroup)
      this.shoeGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
      this.shoeGroup = null
    }
  }
}
