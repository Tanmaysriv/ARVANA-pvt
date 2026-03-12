import { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei'
import { X, Camera, RotateCcw, Download, Share2, ZoomIn, ZoomOut, Settings } from 'lucide-react'
import { useARDetection } from '../hooks/useARDetection'
import { WebcamBackground } from './WebcamBackground'
import { VirtualTryOnModel } from './VirtualTryOnModel'
import { getModelComponent } from '../services/modelGenerator'
import { GenericBoxModel } from '../services/modelGenerator'

const ARTryOn = ({ product, onClose }) => {
  const videoRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [currentPose, setCurrentPose] = useState(null)
  const [showControls, setShowControls] = useState(false)
  const [adjustments, setAdjustments] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0
  })

  const {
    detections,
    isModelLoaded,
    startDetection,
    stopDetection
  } = useARDetection(videoRef, product?.category)

  useEffect(() => {
    initializeCamera()
    return () => {
      stopCamera()
      stopDetection()
    }
  }, [stopDetection])

  // Update pose state when detections change
  useEffect(() => {
    if (detections && detections.normalizedKeypoints) {
      setCurrentPose(detections.normalizedKeypoints)
      console.log('Pose detected:', detections.normalizedKeypoints)
    }
  }, [detections])

  const initializeCamera = async () => {
    try {
      setIsLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setIsCameraActive(true)
          setIsLoading(false)
          startDetection()
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Unable to access camera. Please grant camera permissions.')
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
    // For 3D rendering, we'll need to render the scene to a canvas
    // This is a simplified version - in production you'd render the Three.js scene
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 1280
    canvas.height = 720

    if (videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const image = canvas.toDataURL('image/png')
      setCapturedImage(image)
    }
  }

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a')
      link.download = `arvana-tryon-${Date.now()}.png`
      link.href = capturedImage
      link.click()
    }
  }

  const sharePhoto = async () => {
    if (capturedImage && navigator.share) {
      try {
        const blob = await (await fetch(capturedImage)).blob()
        const file = new File([blob], 'arvana-tryon.png', { type: 'image/png' })
        await navigator.share({
          files: [file],
          title: 'My ARVANA Virtual Try-On',
          text: `Check out how I look in ${product?.name}!`
        })
      } catch (err) {
        console.error('Share error:', err)
      }
    }
  }

  const resetCapture = () => {
    setCapturedImage(null)
  }

  const getInstructions = () => {
    switch (product?.category) {
      case 'shoes':
        return 'Point camera at your feet and stand in good lighting for accurate shoe positioning'
      case 'bags':
        return 'Hold your hand up or point at your shoulder area for bag positioning'
      case 'clothes':
        return 'Position yourself in frame showing upper body for clothing overlay'
      case 'watches':
        return 'Show your wrist to the camera for watch positioning'
      default:
        return 'Position yourself in the camera view with good lighting'
    }
  }

  // Get the model component
  const ModelComponent = product ? getModelComponent(product.category, product.id) : null

  useEffect(() => {
    console.log('Product:', product)
    console.log('Model Component:', ModelComponent)
  }, [ModelComponent, product])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-lg text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-bold text-lg">{product?.name || 'AR Virtual Try-On'}</h2>
            <p className="text-sm text-gray-300">{getInstructions()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isModelLoaded && (
            <span className="text-sm text-yellow-400">Loading AI Model...</span>
          )}
          {isModelLoaded && (
            <span className="text-sm text-green-400">● AI Ready</span>
          )}
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Adjustment Controls */}
      {showControls && (
        <div className="bg-black/60 backdrop-blur-lg text-white p-4 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Scale</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={adjustments.scale}
                onChange={(e) => setAdjustments(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <span className="text-xs text-gray-300">{adjustments.scale.toFixed(1)}x</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">X Offset</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={adjustments.offsetX}
                onChange={(e) => setAdjustments(prev => ({ ...prev, offsetX: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Y Offset</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={adjustments.offsetY}
                onChange={(e) => setAdjustments(prev => ({ ...prev, offsetY: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Z Offset</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={adjustments.offsetZ}
                onChange={(e) => setAdjustments(prev => ({ ...prev, offsetZ: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main AR View */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500 mx-auto mb-4"></div>
              <p className="text-lg">Initializing AR Camera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white max-w-md p-8">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-lg mb-4">{error}</p>
              <button onClick={initializeCamera} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            {/* Hidden video element for pose detection and webcam background */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ display: 'none' }}
            />

            {/* Three.js Canvas for 3D rendering */}
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ width: '100%', height: '100%' }}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <WebcamBackground videoRef={videoRef} />

                {/* Lighting */}
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <directionalLight position={[-5, -5, 5]} intensity={0.8} />
                <ambientLight intensity={0.8} />
                <pointLight position={[0, 0, 2]} intensity={0.5} />

                {currentPose && ModelComponent && (
                  <VirtualTryOnModel
                    product={product}
                    poseKeypoints={currentPose}
                    category={product?.category}
                    modelComponent={ModelComponent}
                    adjustments={adjustments}
                  />
                )}

                {/* Fallback debug cube if model isn't showing */}
                {currentPose && !ModelComponent && (
                  <mesh position={[0, 0, -3]}>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial color="#ff6b6b" />
                  </mesh>
                )}

                <Environment preset="studio" />
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
              </Suspense>
            </Canvas>
          </>
        )}

        {/* AR Overlay UI */}
        {isCameraActive && !capturedImage && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner Markers */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-primary-500"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-primary-500"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-primary-500"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-primary-500"></div>

            {/* Detection Status */}
            {currentPose && currentPose.length > 0 && (
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-green-500/80 text-white px-4 py-2 rounded-full text-sm font-semibold">
                ✓ Pose detected - 3D model active
              </div>
            )}
          </div>
        )}

        {/* Product Info Overlay */}
        {product && !capturedImage && (
          <div className="absolute bottom-24 left-4 right-4 glass-effect rounded-xl p-4 text-white">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-gray-300">{product.description}</p>
                <p className="text-lg font-bold text-primary-400">${product.price}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/80 backdrop-blur-lg p-4">
        {capturedImage ? (
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetCapture}
              className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake</span>
            </button>
            <button
              onClick={downloadPhoto}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            <button
              onClick={sharePhoto}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={capturePhoto}
              disabled={!isCameraActive || !isModelLoaded}
              className="w-16 h-16 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ARTryOn
