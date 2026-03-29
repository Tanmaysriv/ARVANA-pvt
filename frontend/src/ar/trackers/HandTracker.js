/**
 * HandTracker.js — v2
 * Wraps MediaPipe Hands for wrist/finger landmark detection.
 * Uses exact-version CDN URLs to prevent WASM loading issues.
 */

import { Hands } from '@mediapipe/hands'
import { smoothLandmark } from '../utils/poseUtils.js'

const SMOOTH_ALPHA = 0.45
const CDN_VERSION = '0.4.1675469240'

export class HandTracker {
  constructor() {
    this.hands = null
    this.results = null
    this._prevLandmarks = [null, null]
    this._onResults = null
    this._ready = false
  }

  async init(onResults) {
    this._onResults = onResults

    this.hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${CDN_VERSION}/${file}`,
    })

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.55,
    })

    this.hands.onResults((results) => this._processResults(results))

    // Force initialize by sending a blank frame
    try {
      const initCanvas = document.createElement('canvas')
      initCanvas.width = 10
      initCanvas.height = 10
      await this.hands.send({ image: initCanvas })
    } catch (e) {
      // Ignore init frame errors — the model is now loaded
    }

    this._ready = true
  }

  async send(videoElement) {
    if (!this._ready || !this.hands || !videoElement) return
    try {
      await this.hands.send({ image: videoElement })
    } catch (e) {
      // Silently ignore frame errors
    }
  }

  _processResults(results) {
    const smoothed = []

    if (results.multiHandLandmarks?.length > 0) {
      for (let h = 0; h < results.multiHandLandmarks.length; h++) {
        const landmarks = results.multiHandLandmarks[h]
        const smoothedLandmarks = landmarks.map((lm, i) => {
          const prev = this._prevLandmarks[h]?.[i] || null
          return smoothLandmark(prev, lm, SMOOTH_ALPHA)
        })
        smoothed.push(smoothedLandmarks)
        this._prevLandmarks[h] = smoothedLandmarks
      }
    } else {
      this._prevLandmarks = [null, null]
    }

    this.results = { ...results, multiHandLandmarks: smoothed }
    if (this._onResults) this._onResults(this.results)
  }

  getLandmarks(handIndex = 0) {
    return this.results?.multiHandLandmarks?.[handIndex] || null
  }

  getHandedness(handIndex = 0) {
    return this.results?.multiHandedness?.[handIndex]?.label || 'Right'
  }

  async destroy() {
    this._ready = false
    if (this.hands) {
      try { await this.hands.close() } catch (_) {}
      this.hands = null
    }
  }
}
