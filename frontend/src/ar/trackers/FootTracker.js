/**
 * FootTracker.js — v2
 * Wraps MediaPipe Pose for ankle/heel/toe landmark detection.
 * Used for shoe AR try-on.
 */

import { Pose } from '@mediapipe/pose'
import { smoothLandmark } from '../utils/poseUtils.js'

const SMOOTH_ALPHA = 0.45
const CDN_VERSION = '0.5.1675469404'

export class FootTracker {
  constructor() {
    this.pose = null
    this.results = null
    this._prevLandmarks = null
    this._onResults = null
    this._ready = false
  }

  async init(onResults) {
    this._onResults = onResults

    this.pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${CDN_VERSION}/${file}`,
    })

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    })

    this.pose.onResults((results) => this._processResults(results))

    // Force-init the WASM model by sending a blank frame
    try {
      const initCanvas = document.createElement('canvas')
      initCanvas.width = 10
      initCanvas.height = 10
      await this.pose.send({ image: initCanvas })
    } catch (e) {
      // Ignore init errors
    }

    this._ready = true
  }

  async send(videoElement) {
    if (!this._ready || !this.pose || !videoElement) return
    try {
      await this.pose.send({ image: videoElement })
    } catch (e) {
      // Silently ignore frame errors
    }
  }

  _processResults(results) {
    let smoothedPose = null

    if (results.poseLandmarks) {
      smoothedPose = results.poseLandmarks.map((lm, i) => {
        const prev = this._prevLandmarks?.[i] || null
        return smoothLandmark(prev, lm, SMOOTH_ALPHA)
      })
      this._prevLandmarks = smoothedPose
    } else {
      this._prevLandmarks = null
    }

    this.results = { ...results, poseLandmarks: smoothedPose }
    if (this._onResults) this._onResults(this.results)
  }

  async destroy() {
    this._ready = false
    if (this.pose) {
      try { await this.pose.close() } catch (_) {}
      this.pose = null
    }
  }
}
