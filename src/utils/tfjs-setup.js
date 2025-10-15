// TensorFlow.js setup - Force WebGL backend only
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgpu'

// Just export tf as-is
// The hook will handle backend selection
export { tf }
