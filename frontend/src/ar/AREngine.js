/**
 * AREngine.js — v2 (Premium)
 * Master AR orchestrator:
 *  - Selects tracker + renderer per product category
 *  - Runs webcam → MediaPipe → Three.js → canvas composite loop
 *  - Adds environment map for realistic PBR reflections
 *  - Jewelry products use RingRenderer
 */

import * as THREE from 'three'
import { HandTracker } from './trackers/HandTracker.js'
import { FootTracker } from './trackers/FootTracker.js'
import { BodyTracker } from './trackers/BodyTracker.js'
import { WatchRenderer } from './renderers/WatchRenderer.js'
import { RingRenderer } from './renderers/RingRenderer.js'
import { ShoeRenderer } from './renderers/ShoeRenderer.js'
import { BagRenderer } from './renderers/BagRenderer.js'
import { ClothesRenderer } from './renderers/ClothesRenderer.js'
import {
  getWatchTransform,
  getShoeTransform,
  getBagTransform,
  getClothesTransform,
  getRingTransform,
} from './utils/transformUtils.js'

// ── Category → tracker & renderer mapping ──
const CATEGORY_CONFIG = {
  watches:     { tracker: 'hand', renderer: 'watch' },
  jewelry:     { tracker: 'hand', renderer: 'ring'  },
  accessories: { tracker: 'hand', renderer: 'watch' },
  shoes:       { tracker: 'foot', renderer: 'shoe'  },
  bags:        { tracker: 'body', renderer: 'bag'   },
  clothes:     { tracker: 'body', renderer: 'clothes' },
  default:     { tracker: 'hand', renderer: 'watch' },
}

export class AREngine {
  constructor(canvas, video, product) {
    this.canvas = canvas
    this.video = video
    this.product = product
    this.category = (product?.category || 'watches').toLowerCase()

    // State
    this._running = false
    this._animId = null
    this._lastTime = 0
    this._initDone = false
    this._landmarks = null
    this._handedness = 'Right'
    this._frameCount = 0
    this._status = 'loading'

    // Status callback
    this.onStatusChange = null

    // Three.js
    this.threeRenderer = null
    this.scene = null
    this.camera = null

    // Trackers & Renderers
    this.tracker = null
    this.productRenderer = null
    this.leftShoeRenderer = null
    this.rightShoeRenderer = null
  }

  // ──────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────

  async init() {
    this._setStatus('loading')

    const { tracker: trackerType, renderer: rendererType } =
      CATEGORY_CONFIG[this.category] || CATEGORY_CONFIG.default

    this._setupThree()
    this._setupRenderer(rendererType)

    // Init tracker with timeout — MediaPipe WASM can hang
    try {
      await this._withTimeout(this._setupTracker(trackerType), 20000)
    } catch (err) {
      console.error('[AREngine] Tracker init failed or timed out:', err)
      this._setStatus('error')
      // Still allow the engine to run — webcam will show, just no landmarks
    }

    this._initDone = true
    if (this._status !== 'error') {
      this._setStatus('positioning')
    }
  }

  _withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
      ),
    ])
  }

  _setupThree() {
    const w = this.canvas.width || 640
    const h = this.canvas.height || 480
    const aspect = w / h

    this.scene = new THREE.Scene()

    // Orthographic camera: x ∈ [-aspect, aspect], y ∈ [-1, 1]
    this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100)
    this.camera.position.z = 2

    // ── Lighting (3-point setup for premium look) ──
    // Key light — warm white from top-right
    const keyLight = new THREE.DirectionalLight(0xfff8e7, 1.4)
    keyLight.position.set(2, 3, 3)
    this.scene.add(keyLight)

    // Fill light — cool blue from left
    const fillLight = new THREE.DirectionalLight(0xccddff, 0.5)
    fillLight.position.set(-2, -1, 2)
    this.scene.add(fillLight)

    // Rim light — backlight for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6)
    rimLight.position.set(0, -2, -2)
    this.scene.add(rimLight)

    // Ambient — slight warmth
    const ambient = new THREE.AmbientLight(0xfff5e6, 0.55)
    this.scene.add(ambient)

    // ── Environment map for realistic PBR reflections ──
    this._addEnvironmentMap()

    // ── WebGL renderer ──
    this.threeRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    this.threeRenderer.setSize(w, h)
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.threeRenderer.setClearColor(0x000000, 0)
    this.threeRenderer.toneMapping = THREE.ACESFilmicToneMapping
    this.threeRenderer.toneMappingExposure = 1.1
    this.threeRenderer.outputColorSpace = THREE.SRGBColorSpace
  }

  _addEnvironmentMap() {
    // Create a simple procedural environment (gradient cubemap)
    // This gives PBR metals something to reflect without loading an HDR
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // Soft gradient: warm top → cool bottom (like studio HDRI)
    const grad = ctx.createLinearGradient(0, 0, 0, size)
    grad.addColorStop(0, '#f8f0e0')     // warm white at top
    grad.addColorStop(0.3, '#d0d8e8')   // neutral
    grad.addColorStop(0.6, '#909ab0')   // cool mid
    grad.addColorStop(1, '#404860')     // dark bottom
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    // Add a "bright spot" (simulates studio softbox)
    const spotGrad = ctx.createRadialGradient(size * 0.7, size * 0.25, 0, size * 0.7, size * 0.25, size * 0.35)
    spotGrad.addColorStop(0, 'rgba(255,255,245,0.8)')
    spotGrad.addColorStop(1, 'rgba(255,255,245,0)')
    ctx.fillStyle = spotGrad
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping

    this.scene.environment = texture
  }

  async _setupTracker(trackerType) {
    switch (trackerType) {
      case 'hand':
        this.tracker = new HandTracker()
        await this.tracker.init((results) => this._onHandResults(results))
        break
      case 'foot':
        this.tracker = new FootTracker()
        await this.tracker.init((results) => this._onFootResults(results))
        break
      case 'body':
        this.tracker = new BodyTracker()
        await this.tracker.init((results) => this._onBodyResults(results))
        break
    }
  }

  _setupRenderer(rendererType) {
    const color = this.product?.colors?.[0] || '#2c2c2c'

    switch (rendererType) {
      case 'watch':
        this.productRenderer = new WatchRenderer(this.scene, color)
        break
      case 'ring':
        this.productRenderer = new RingRenderer(this.scene, color, 'solitaire')
        break
      case 'shoe':
        this.leftShoeRenderer = new ShoeRenderer(this.scene, color, 'left')
        this.rightShoeRenderer = new ShoeRenderer(this.scene, color, 'right')
        this.productRenderer = this.rightShoeRenderer
        break
      case 'bag':
        this.productRenderer = new BagRenderer(this.scene, color)
        break
      case 'clothes':
        this.productRenderer = new ClothesRenderer(this.scene, color, this.product?.name || '')
        break
      default:
        console.warn(`⚠️ Unknown renderer type: ${rendererType}`)
    }
  }

  // ──────────────────────────────────────────────
  // LANDMARK CALLBACKS
  // ──────────────────────────────────────────────

  _onHandResults(results) {
    const landmarks = results?.multiHandLandmarks?.[0]
    const handedness = results?.multiHandedness?.[0]?.label || 'Right'
    this._landmarks = landmarks || null
    this._handedness = handedness

    this._setStatus(landmarks ? 'ready' : 'positioning')
  }

  _onFootResults(results) {
    this._landmarks = results?.poseLandmarks || null
    this._setStatus(this._landmarks ? 'ready' : 'positioning')
  }

  _onBodyResults(results) {
    this._landmarks = results?.poseLandmarks || null
    this._leftHandLandmarks = results?.leftHandLandmarks || null
    this._rightHandLandmarks = results?.rightHandLandmarks || null
    this._setStatus(this._landmarks ? 'ready' : 'positioning')
  }

  // ──────────────────────────────────────────────
  // FRAME LOOP
  // ──────────────────────────────────────────────

  start() {
    if (this._running) return
    this._running = true
    this._lastTime = performance.now()
    this._animId = requestAnimationFrame(this._loop)
  }

  stop() {
    this._running = false
    if (this._animId) {
      cancelAnimationFrame(this._animId)
      this._animId = null
    }
  }

  _loop = (now) => {
    if (!this._running) return
    const dt = Math.min((now - this._lastTime) / 1000, 0.1)
    this._lastTime = now

    // Send frame to MediaPipe (fire-and-forget, don't block rAF)
    // Only send every other frame to reduce CPU load
    this._frameCount++
    if (this.tracker && this.video && this.video.readyState >= 2 && this._frameCount % 2 === 0) {
      this.tracker.send(this.video).catch(() => {})
    }

    // Update product model transforms from latest landmarks
    this._updateProductTransform(dt)

    // Render Three.js scene
    if (this.threeRenderer && this.scene && this.camera) {
      this.threeRenderer.render(this.scene, this.camera)
    }

    // Composite: webcam + 3D overlay → output canvas
    this._composite()

    this._animId = requestAnimationFrame(this._loop)
  }

  _updateProductTransform(dt) {
    const vw = this.video?.videoWidth || 1280
    const vh = this.video?.videoHeight || 720
    const cw = this.canvas?.width || 1280
    const ch = this.canvas?.height || 720

    if (!this._landmarks) {
      this.productRenderer?.setVisible?.(false)
      this.leftShoeRenderer?.setVisible?.(false)
      this.rightShoeRenderer?.setVisible?.(false)
      return
    }

    switch (this.category) {
      case 'watches':
      case 'accessories': {
        const transform = getWatchTransform(this._landmarks, vw, vh, this._handedness)
        this.productRenderer?.applyTransform(transform)
        break
      }
      case 'jewelry': {
        const transform = getRingTransform(this._landmarks, 'ring', vw, vh)
        this.productRenderer?.applyTransform(transform)
        break
      }
      case 'shoes': {
        const rT = getShoeTransform(this._landmarks, 'right', vw, vh)
        const lT = getShoeTransform(this._landmarks, 'left', vw, vh)
        this.rightShoeRenderer?.applyTransform(rT)
        this.leftShoeRenderer?.applyTransform(lT)
        break
      }
      case 'bags': {
        const transform = getBagTransform(this._landmarks, 'right', vw, vh)
        this.productRenderer?.applyTransform(transform, dt)
        break
      }
      case 'clothes': {
        // Use softwear-style VtoPoseEngine + bone mapper
        this.productRenderer?.applyPose?.(this._landmarks, this.camera)
        break
      }

    }
  }

  _composite() {
    const ctx = this.canvas.getContext('2d')
    if (!ctx || !this.video) return

    const { width, height } = this.canvas
    if (!width || !height) return

    ctx.clearRect(0, 0, width, height)

    // 1. Draw webcam video (mirrored for selfie)
    if (this.video.readyState >= 2) {
      ctx.save()
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(this.video, 0, 0, width, height)
      ctx.restore()
    }

    // 2. Draw Three.js overlay (NOT mirrored — it handles coordinate mapping internally)
    if (this.threeRenderer?.domElement) {
      ctx.drawImage(this.threeRenderer.domElement, 0, 0, width, height)
    } else {
      if (this._frameCount % 30 === 0) {
        console.warn(`⚠️ threeRenderer.domElement missing!`)
      }
    }
  }

  // ──────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────

  setColor(color) {
    this.productRenderer?.setColor?.(color)
    this.leftShoeRenderer?.setColor?.(color)
    this.rightShoeRenderer?.setColor?.(color)
  }

  captureScreenshot() {
    return this.canvas.toDataURL('image/png')
  }

  _setStatus(status) {
    this._status = status
    if (this.onStatusChange) this.onStatusChange(status)
  }

  resize(width, height) {
    this.canvas.width = width
    this.canvas.height = height
    if (this.threeRenderer) this.threeRenderer.setSize(width, height)
    if (this.camera) {
      const aspect = width / height
      this.camera.left = -aspect
      this.camera.right = aspect
      this.camera.updateProjectionMatrix()
    }
  }

  async destroy() {
    this.stop()
    await this.tracker?.destroy?.()
    this.productRenderer?.dispose?.()
    this.leftShoeRenderer?.dispose?.()
    this.rightShoeRenderer?.dispose?.()
    if (this.scene?.environment) {
      this.scene.environment.dispose()
    }
    this.threeRenderer?.dispose?.()
    this.scene = null
    this.camera = null
  }
}
