import { useState, useEffect, useRef, useCallback } from 'react'
import { tf } from '../utils/tfjs-setup'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'
import { normalizeKeypoints } from '../utils/poseMapping'

// Model cache to avoid reloading
const modelCache = {
  pose: null,
  hand: null,
  face: null
}

// Configuration for efficient inference
const INFERENCE_CONFIG = {
  frameSkip: 2, // Process every 2nd frame for better performance
  minConfidence: 0.5,
  maxPoses: 1,
  maxHands: 2
}

export const useARDetection = (videoRef, category) => {
  const [detections, setDetections] = useState(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const animationFrameRef = useRef(null)
  const detectorRef = useRef(null)
  const frameCountRef = useRef(0)
  const isProcessingRef = useRef(false)

  // Define stopDetection first so it can be used in useEffect cleanup
  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Clean up processing state
    isProcessingRef.current = false
    frameCountRef.current = 0
  }, [])

  useEffect(() => {
    loadModel()
    return () => {
      stopDetection()
    }
  }, [category, stopDetection])

  const loadModel = async () => {
    try {
      // Configure TensorFlow.js for optimal performance
      await tf.ready()
      
      // Force WebGL backend (avoid WebGPU)
      const backend = tf.getBackend()
      if (backend !== 'webgl') {
        await tf.setBackend('webgl')
      }
      
      // Enable memory optimization flags
      tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0)
      tf.env().set('WEBGL_FORCE_F16_TEXTURES', true)
      
      // Load appropriate model based on category
      switch (category) {
        case 'shoes':
        case 'clothes':
          await loadPoseModel()
          break
        case 'watches':
        case 'bags':
          await loadHandModel()
          break
        default:
          await loadPoseModel()
      }
      
      setIsModelLoaded(true)
    } catch (error) {
      console.error('Error loading model:', error)
      setIsModelLoaded(false)
    }
  }

  const loadPoseModel = async () => {
    if (modelCache.pose) {
      detectorRef.current = modelCache.pose
      return
    }
    const model = poseDetection.SupportedModels.BlazePose
    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'lite',
      enableSmoothing: true
    }
    
    const detector = await poseDetection.createDetector(model, detectorConfig)
    modelCache.pose = detector
    detectorRef.current = detector
  }

  const loadHandModel = async () => {
    if (modelCache.hand) {
      detectorRef.current = modelCache.hand
      return
    }
    const model = handPoseDetection.SupportedModels.MediaPipeHands
    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'lite', // Use lite model for better performance
      maxHands: INFERENCE_CONFIG.maxHands,
      detectorModelUrl: undefined, // Use default CDN
      landmarkModelUrl: undefined
    }
    
    const detector = await handPoseDetection.createDetector(model, detectorConfig)
    modelCache.hand = detector
    detectorRef.current = detector
  }

  const startDetection = () => {
    if (!videoRef.current) return
    
    const detectFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current
        
        // Frame skipping for performance optimization
        frameCountRef.current++
        const shouldProcess = frameCountRef.current % INFERENCE_CONFIG.frameSkip === 0
        
        if (shouldProcess && detectorRef.current && !isProcessingRef.current) {
          isProcessingRef.current = true
          
          try {
            // Run inference asynchronously
            const predictions = await detectorRef.current.estimatePoses?.(video) || 
                                await detectorRef.current.estimateHands?.(video) || []
            
            if (predictions && predictions.length > 0) {
              const prediction = predictions[0]
              
              // Normalize keypoints for 3D positioning
              let normalizedKeypoints = []
              if (prediction.keypoints && videoRef.current) {
                normalizedKeypoints = normalizeKeypoints(
                  prediction.keypoints, 
                  videoRef.current.videoWidth, 
                  videoRef.current.videoHeight
                )
              }
              
              // Update detections with normalized keypoints
              setDetections({
                ...prediction,
                normalizedKeypoints
              })
            }
          } catch (error) {
            console.error('Detection error:', error)
          } finally {
            isProcessingRef.current = false
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(detectFrame)
    }
    
    detectFrame()
  }

  return {
    detections,
    isModelLoaded,
    startDetection,
    stopDetection
  }
}

export default useARDetection
