/**
 * RingRenderer.js — v2
 * Renders a ring on the finger.
 * Torus in XY plane (default) — visible as circle from camera (+Z).
 * NO rotation needed on the torus. Group rotation.z aligns with finger angle.
 */

import * as THREE from 'three'

export class RingRenderer {
  constructor(scene, color = '#d4a947', style = 'solitaire') {
    this.scene = scene
    this.ringGroup = null
    this.targetColor = color
    this.style = style
    this._createModel(color, style)
  }

  _createModel(color, style = 'solitaire') {
    if (this.ringGroup) {
      this.scene.remove(this.ringGroup)
      this.ringGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
    }

    const group = new THREE.Group()
    const hex = this._resolveColor(color)

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: hex, roughness: 0.06, metalness: 1.0,
      reflectivity: 1.0, clearcoat: 0.9, clearcoatRoughness: 0.04,
    })
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: this._darken(hex, 0.1), roughness: 0.15, metalness: 0.9,
    })

    // ── BAND (torus in XY plane — default orientation, NO rotation needed) ──
    // Torus default: ring in XY plane, hole along Z. From camera (+Z), displays as a circular ring ✓
    const bandGeo = new THREE.TorusGeometry(0.48, 0.11, 24, 64)
    const band = new THREE.Mesh(bandGeo, metalMat)
    group.add(band)

    // Inner band (slightly smaller, recessed)
    const innerGeo = new THREE.TorusGeometry(0.40, 0.045, 16, 48)
    const inner = new THREE.Mesh(innerGeo, innerMat)
    inner.position.z = 0.01
    group.add(inner)

    if (style === 'solitaire') {
      const settingMat = new THREE.MeshPhysicalMaterial({
        color: hex, roughness: 0.08, metalness: 1.0,
      })

      // 4-prong setting (small cylinders around gem, sticking up in +Z)
      for (let i = 0; i < 4; i++) {
        const pAngle = (i / 4) * Math.PI * 2 + Math.PI / 4
        const prong = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.018, 0.26, 8),
          settingMat
        )
        prong.position.set(Math.cos(pAngle) * 0.12, Math.sin(pAngle) * 0.12, 0.12)
        prong.rotation.x = Math.PI / 2   // prong axis along Z ✓
        group.add(prong)
      }

      // Setting basket (thin cylinder base)
      const basketGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.04, 16)
      const basket = new THREE.Mesh(basketGeo, settingMat)
      basket.position.z = 0.04
      basket.rotation.x = Math.PI / 2   // face along Z ✓
      group.add(basket)

      // ── DIAMOND (octahedron gem) ──
      const diamondMat = new THREE.MeshPhysicalMaterial({
        color: 0xe8f4ff, roughness: 0.0, metalness: 0.0,
        transmission: 0.92, ior: 2.42, thickness: 0.25,
        transparent: true, opacity: 0.95,
      })
      const diamGeo = new THREE.OctahedronGeometry(0.16, 0)
      const diamond = new THREE.Mesh(diamGeo, diamondMat)
      diamond.position.z = 0.22
      diamond.rotation.z = Math.PI / 4
      diamond.scale.set(1.0, 1.0, 0.65)   // slightly flat (table cut)
      group.add(diamond)

      // Gem facet reflections (bright points on top faces)
      const facetMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.0, metalness: 0.0,
        transmission: 0.6, transparent: true, opacity: 0.65,
      })
      for (let i = 0; i < 6; i++) {
        const fa = (i / 6) * Math.PI * 2
        const fGeo = new THREE.TetrahedronGeometry(0.058, 0)
        const facet = new THREE.Mesh(fGeo, facetMat)
        facet.position.set(Math.cos(fa) * 0.078, Math.sin(fa) * 0.078, 0.22)
        group.add(facet)
      }

    } else if (style === 'eternity') {
      // Eternity band: small gems going around the torus
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xaaddff, roughness: 0.0, metalness: 0.0,
        transmission: 0.88, transparent: true, opacity: 0.9, ior: 1.8,
      })
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2
        const gem = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), gemMat)
        gem.position.set(Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0.12)
        group.add(gem)
      }
    }

    this.scene.add(group)
    this.ringGroup = group
  }

  applyTransform(transform) {
    if (!this.ringGroup || !transform) { this.setVisible(false); return }
    this.setVisible(true)
    this.ringGroup.position.copy(transform.position)
    this.ringGroup.scale.copy(transform.scale)
    // Only apply Z rotation (align ring with finger direction)
    this.ringGroup.rotation.set(0, 0, transform.rotation.z)
  }

  setColor(color) {
    if (color === this.targetColor) return
    this.targetColor = color
    this._createModel(color, this.style)
  }
  setVisible(v) { if (this.ringGroup) this.ringGroup.visible = v }

  _resolveColor(c) {
    if (!c) return 0xd4a947
    if (typeof c === 'number') return c
    const m = { gold:'#c9a84c', 'rose gold':'#b76e79', silver:'#c0c0c0',
      white:'#e8e8e8', black:'#2a2a2a', platinum:'#d0d0d0' }
    return parseInt((m[c.trim().toLowerCase()] || c).replace('#',''), 16)
  }
  _darken(h, a) {
    return ((Math.max(0,((h>>16)&0xff)-a*255)|0)<<16)|((Math.max(0,((h>>8)&0xff)-a*255)|0)<<8)|(Math.max(0,(h&0xff)-a*255)|0)
  }

  dispose() {
    if (this.ringGroup) {
      this.scene.remove(this.ringGroup)
      this.ringGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
      this.ringGroup = null
    }
  }
}
