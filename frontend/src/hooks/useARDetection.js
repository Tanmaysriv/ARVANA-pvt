import { useState, useEffect, useRef } from 'react'
import { tf } from '../utils/tfjs-setup'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'

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

export const useARDetection = (videoRef, canvasRef, category, productImage) => {
  const [detections, setDetections] = useState(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const animationFrameRef = useRef(null)
  const productImgRef = useRef(null)
  const detectorRef = useRef(null)
  const frameCountRef = useRef(0)
  const isProcessingRef = useRef(false)

  useEffect(() => {
    loadModel()
    loadProductImage()
    return () => {
      stopDetection()
    }
  }, [category, productImage])

  const loadProductImage = () => {
    if (productImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = productImage
      img.onload = () => {
        productImgRef.current = img
      }
    }
  }

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
    if (!videoRef.current || !canvasRef.current) return
    
    const detectFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current
        const canvas = canvasRef.current
        
        // Set canvas dimensions only once or when changed
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }
        
        const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false })
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
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
              setDetections(predictions)
              drawDetections(ctx, predictions, canvas.width, canvas.height)
            }
          } catch (error) {
            console.error('Detection error:', error)
          } finally {
            isProcessingRef.current = false
          }
        } else if (detections) {
          // Reuse previous detections for skipped frames
          drawDetections(ctx, detections, canvas.width, canvas.height)
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(detectFrame)
    }
    
    detectFrame()
  }

  const drawDetections = (ctx, predictions, width, height) => {
    ctx.save()
    
    const centerX = width / 2
    const centerY = height / 2
    
    // Draw based on category and actual detections
    switch (category) {
      case 'shoes':
        drawShoesWithPose(ctx, predictions, centerX, height, width)
        break
      case 'watches':
        drawWatchWithHand(ctx, predictions, centerX, centerY)
        break
      case 'bags':
        drawBagWithHand(ctx, predictions, centerX, centerY)
        break
      case 'clothes':
        drawClothesWithPose(ctx, predictions, centerX, centerY, width)
        break
    }
    
    ctx.restore()
  }

  const drawShoesWithPose = (ctx, poses, centerX, canvasHeight, canvasWidth) => {
    let leftAnkle = null
    let rightAnkle = null
    
    // Extract ankle positions from pose detection
    if (poses && poses.length > 0 && poses[0].keypoints) {
      const keypoints = poses[0].keypoints
      leftAnkle = keypoints.find(kp => kp.name === 'left_ankle' && kp.score > INFERENCE_CONFIG.minConfidence)
      rightAnkle = keypoints.find(kp => kp.name === 'right_ankle' && kp.score > INFERENCE_CONFIG.minConfidence)
    }
    
    const shoeWidth = 120
    const shoeHeight = 140
    
    // Use detected positions or fallback to center
    const leftX = leftAnkle ? leftAnkle.x : centerX - 80
    const leftY = leftAnkle ? leftAnkle.y + 40 : canvasHeight - 140
    const rightX = rightAnkle ? rightAnkle.x : centerX + 80
    const rightY = rightAnkle ? rightAnkle.y + 40 : canvasHeight - 140
    
    ctx.globalAlpha = 0.85
    ctx.fillStyle = '#1e40af'
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 4
    
    // Left shoe
    ctx.beginPath()
    ctx.ellipse(leftX, leftY, shoeWidth/2, shoeHeight/3, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right shoe
    ctx.beginPath()
    ctx.ellipse(rightX, rightY, shoeWidth/2, shoeHeight/3, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.globalAlpha = 0.9
      ctx.drawImage(productImgRef.current, leftX - 50, leftY - 50, 100, 100)
      ctx.drawImage(productImgRef.current, rightX - 50, rightY - 50, 100, 100)
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('👟 Shoes Try-On', centerX, Math.min(leftY, rightY) - 80)
  }

  const drawWatchWithHand = (ctx, hands, centerX, centerY) => {
    let wristX = centerX - 180
    let wristY = centerY + 120
    
    // Use detected wrist position if available
    if (hands && hands.length > 0 && hands[0].keypoints) {
      const wrist = hands[0].keypoints.find(kp => kp.name === 'wrist')
      if (wrist && wrist.score > INFERENCE_CONFIG.minConfidence) {
        wristX = wrist.x
        wristY = wrist.y
      }
    }
    
    // Watch face
    ctx.globalAlpha = 0.9
    ctx.fillStyle = '#1f2937'
    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 4
    
    ctx.beginPath()
    ctx.arc(wristX, wristY, 50, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Watch band
    ctx.fillStyle = '#374151'
    ctx.fillRect(wristX - 60, wristY - 15, 30, 30)
    ctx.fillRect(wristX + 30, wristY - 15, 30, 30)
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(wristX, wristY, 45, 0, 2 * Math.PI)
      ctx.clip()
      ctx.globalAlpha = 0.95
      ctx.drawImage(productImgRef.current, wristX - 45, wristY - 45, 90, 90)
      ctx.restore()
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('⌚ Watch Try-On', wristX, wristY - 80)
  }

  const drawBagWithHand = (ctx, hands, centerX, centerY) => {
    let bagX = centerX + 80
    let bagY = centerY - 120
    
    // Use detected hand position (shoulder area simulation)
    if (hands && hands.length > 0 && hands[0].keypoints) {
      const wrist = hands[0].keypoints.find(kp => kp.name === 'wrist')
      if (wrist && wrist.score > INFERENCE_CONFIG.minConfidence) {
        bagX = wrist.x + 100
        bagY = wrist.y - 150
      }
    }
    
    const bagWidth = 140
    const bagHeight = 160
    
    // Bag body
    ctx.globalAlpha = 0.85
    ctx.fillStyle = '#92400e'
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 4
    
    ctx.fillRect(bagX, bagY, bagWidth, bagHeight)
    ctx.strokeRect(bagX, bagY, bagWidth, bagHeight)
    
    // Bag handle
    ctx.beginPath()
    ctx.arc(bagX + bagWidth/2, bagY, 50, Math.PI, 0, true)
    ctx.stroke()
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.globalAlpha = 0.9
      ctx.drawImage(productImgRef.current, bagX + 10, bagY + 10, bagWidth - 20, bagHeight - 20)
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('👜 Bag Try-On', bagX + bagWidth/2, bagY - 80)
  }

  const drawClothesWithPose = (ctx, poses, centerX, centerY, canvasWidth) => {
    let shoulderLeft = null
    let shoulderRight = null
    let hip = null
    
    // Extract body keypoints from pose detection
    if (poses && poses.length > 0 && poses[0].keypoints) {
      const keypoints = poses[0].keypoints
      shoulderLeft = keypoints.find(kp => kp.name === 'left_shoulder' && kp.score > INFERENCE_CONFIG.minConfidence)
      shoulderRight = keypoints.find(kp => kp.name === 'right_shoulder' && kp.score > INFERENCE_CONFIG.minConfidence)
      hip = keypoints.find(kp => (kp.name === 'left_hip' || kp.name === 'right_hip') && kp.score > INFERENCE_CONFIG.minConfidence)
    }
    
    const clothesWidth = 280
    let clothesHeight = 240
    
    // Calculate position based on detected pose or use defaults
    let clothesX = centerX - clothesWidth/2
    let clothesY = centerY - 100
    
    if (shoulderLeft && shoulderRight) {
      clothesX = (shoulderLeft.x + shoulderRight.x) / 2 - clothesWidth/2
      clothesY = Math.min(shoulderLeft.y, shoulderRight.y)
      
      if (hip) {
        const detectedHeight = hip.y - clothesY
        if (detectedHeight > 50 && detectedHeight < 500) {
          clothesHeight = detectedHeight
        }
      }
    }
    
    // T-shirt shape
    ctx.globalAlpha = 0.75
    ctx.fillStyle = '#8b5cf6'
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 4
    
    // Body
    ctx.fillRect(clothesX, clothesY, clothesWidth, clothesHeight)
    ctx.strokeRect(clothesX, clothesY, clothesWidth, clothesHeight)
    
    // Sleeves
    ctx.fillRect(clothesX - 60, clothesY, 60, 100)
    ctx.fillRect(clothesX + clothesWidth, clothesY, 60, 100)
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.globalAlpha = 0.85
      ctx.drawImage(productImgRef.current, clothesX + 40, clothesY + 40, clothesWidth - 80, Math.min(clothesHeight - 80, 160))
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('👕 Clothes Try-On', clothesX + clothesWidth/2, clothesY - 20)
  }

  const stopDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Clean up processing state
    isProcessingRef.current = false
    frameCountRef.current = 0
    
    // Dispose of tensors to free memory
    if (detectorRef.current) {
      try {
        // Note: Don't dispose cached models, just clear reference
        detectorRef.current = null
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }
    
  }

  return {
    detections,
    isModelLoaded,
    startDetection,
    stopDetection
  }
}
