/**
 * handTrackingService.js
 * Thin wrapper around MediaPipe Hands.
 * Handles loading, initialization, and camera streaming lifecycle.
 */

import * as mpHands from '@mediapipe/hands'
import * as mpCamera from '@mediapipe/camera_utils'

// Production-safe extraction of constructors
const Hands = mpHands.Hands || window.Hands || mpHands.default?.Hands
const Camera = mpCamera.Camera || window.Camera || mpCamera.default?.Camera

export class HandTrackingService {
  constructor() {
    this.hands  = null
    this.camera = null
    this._onResults = null
  }

  /**
   * Initialize MediaPipe Hands and start the camera.
   * @param {HTMLVideoElement} videoEl  - live webcam video element
   * @param {function} onResults        - callback(results) from MediaPipe
   */
  async init(videoEl, onResults) {
    this._onResults = onResults

    // ── MediaPipe Hands ─────────────────────────────────────────────────────
    this.hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    this.hands.setOptions({
      maxNumHands:          1,
      modelComplexity:      1,   // 0 = lite, 1 = full
      minDetectionConfidence: 0.75,
      minTrackingConfidence:  0.6,
    })

    this.hands.onResults((results) => {
      if (this._onResults) this._onResults(results)
    })

    // ── Camera ──────────────────────────────────────────────────────────────
    this.camera = new Camera(videoEl, {
      onFrame: async () => {
        await this.hands.send({ image: videoEl })
      },
      width:  640,
      height: 480,
    })

    await this.camera.start()
  }

  /** Stop camera and dispose resources */
  async destroy() {
    if (this.camera) {
      await this.camera.stop()
      this.camera = null
    }
    if (this.hands) {
      this.hands.close()
      this.hands = null
    }
  }
}
