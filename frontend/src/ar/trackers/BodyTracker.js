/**
 * BodyTracker.js — v2
 * Wraps MediaPipe Holistic for full-body tracking.
 * Used for clothes/bag/scarf AR try-on.
 */

import { Holistic } from '@mediapipe/holistic'
import { smoothLandmark } from '../utils/poseUtils.js'

const SMOOTH_ALPHA = 0.45
const CDN_VERSION = '0.5.1675471629'

export class BodyTracker {
  constructor() {
    this.holistic = null
    this.results = null
    this._prevPose = null
    this._onResults = null
    this._ready = false
  }

  async init(onResults) {
    this._onResults = onResults

    this.holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@${CDN_VERSION}/${file}`,
    })

    this.holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    })

    this.holistic.onResults((results) => this._processResults(results))

    // Force-init WASM model
    try {
      const initCanvas = document.createElement('canvas')
      initCanvas.width = 10
      initCanvas.height = 10
      await this.holistic.send({ image: initCanvas })
    } catch (e) {
      // Ignore init errors
    }

    this._ready = true
  }

  async send(videoElement) {
    if (!this._ready || !this.holistic || !videoElement) return
    try {
      await this.holistic.send({ image: videoElement })
    } catch (e) {
      // Silently ignore frame errors
    }
  }

  _processResults(results) {
    let smoothedPose = null

    if (results.poseLandmarks) {
      smoothedPose = results.poseLandmarks.map((lm, i) => {
        const prev = this._prevPose?.[i] || null
        return smoothLandmark(prev, lm, SMOOTH_ALPHA)
      })
      this._prevPose = smoothedPose
    } else {
      this._prevPose = null
    }

    this.results = {
      ...results,
      poseLandmarks: smoothedPose,
    }

    if (this._onResults) this._onResults(this.results)
  }

  async destroy() {
    this._ready = false
    if (this.holistic) {
      try { await this.holistic.close() } catch (_) {}
      this.holistic = null
    }
  }
}
