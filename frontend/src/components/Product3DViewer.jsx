import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { X, RotateCw, Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GLTFModel, ModelLoadingFallback } from './GLTFModelLoader'
import { getModelConfig } from '../data/modelUrls'
import { generateDynamicModel, getModelConfigForCategory } from '../services/modelGenerator'
import {
  NikeAirMax,
  AdidasUltraboost,
  ConverseChuckTaylor,
  LeatherToteBag,
  CrossbodyBag,
  ClassicTShirt,
  DenimJacket,
  SummerDress,
  SmartWatchPro,
  ClassicAnalogWatch,
  SportWatch
} from './3DModels'

// 3D Model Component - tries to load GLTF first, falls back to procedural models
const ProductModel = ({ productId, product, color = '#3b82f6', rotation, useGLTF = true }) => {
  const [modelError, setModelError] = useState(false)
  
  // For predefined products (IDs 1-11), use the specific models
  const PREDEFINED_PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const isPredefinedProduct = PREDEFINED_PRODUCT_IDS.includes(productId)
  
  // Get model config - predefined has URL, new products generate dynamically
  const getModelData = () => {
    if (isPredefinedProduct) {
      return {
        config: getModelConfig(productId),
        isDynamic: false
      }
    }
    // For new products, generate config based on category
    return {
      config: getModelConfigForCategory(product?.category),
      isDynamic: true
    }
  }

  const modelData = getModelData()

  // Try to load GLTF model first for predefined products
  if (useGLTF && !modelError && !modelData.isDynamic) {
    return (
      <Suspense fallback={<ModelLoadingFallback />}>
        <ErrorBoundary onError={() => setModelError(true)}>
          <GLTFModel
            url={modelData.config.url}
            scale={modelData.config.scale}
            position={modelData.config.position}
            rotation={rotation}
            color={color}
          />
        </ErrorBoundary>
      </Suspense>
    )
  }

  // Fallback to procedural models (predefined) or dynamic generation (new products)
  const getProceduralModel = () => {
    // Predefined product models
    if (isPredefinedProduct) {
      switch (productId) {
        case 1: return <NikeAirMax color={color} rotation={rotation} />
        case 2: return <AdidasUltraboost color={color} rotation={rotation} />
        case 3: return <ConverseChuckTaylor color={color} rotation={rotation} />
        case 4: return <LeatherToteBag color={color} rotation={rotation} />
        case 5: return <CrossbodyBag color={color} rotation={rotation} />
        case 6: return <ClassicTShirt color={color} rotation={rotation} />
        case 7: return <DenimJacket color={color} rotation={rotation} />
        case 8: return <SummerDress color={color} rotation={rotation} />
        case 9: return <SmartWatchPro color={color} rotation={rotation} />
        case 10: return <ClassicAnalogWatch color={color} rotation={rotation} />
        case 11: return <SportWatch color={color} rotation={rotation} />
        default: return <NikeAirMax color={color} rotation={rotation} />
      }
    }
    
    // Dynamic model generation for new seller products
    const DynamicModel = generateDynamicModel(product?.category)
    return <DynamicModel color={color} rotation={rotation} />
  }

  return getProceduralModel()
}

// Simple Error Boundary for GLTF loading
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('GLTF loading error:', error)
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

// Helper function to convert color names to hex
const getColorHex = (colorName) => {
  const colorMap = {
    'Black': '#1f2937',
    'White': '#f9fafb',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Navy': '#1e3a8a',
    'Gray': '#6b7280',
    'Brown': '#92400e',
    'Tan': '#d2b48c',
    'Silver': '#c0c0c0',
    'Gold': '#ffd700',
    'Rose Gold': '#b76e79',
    'Light Blue': '#93c5fd',
    'Floral': '#ec4899'
  }
  return colorMap[colorName] || colorName
}

// Main 3D Viewer Component
const Product3DViewer = ({ product, isOpen, onClose }) => {
  const [autoRotate, setAutoRotate] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!isOpen || !product) return null
  
  const productColor = getColorHex(product.colors?.[0] || 'Blue')

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-70"
          onClick={onClose}
        />

        {/* 3D Viewer Modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden ${
            isFullscreen ? 'w-full h-full' : 'w-11/12 h-5/6 max-w-6xl'
          }`}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                <p className="text-gray-300">{product.brand}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-3 rounded-lg transition-colors ${
                    autoRotate ? 'bg-primary-600 text-white' : 'bg-white/10 text-white'
                  }`}
                  title="Toggle Auto Rotate"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
              <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
              
              {/* Enhanced Lighting Setup */}
              <ambientLight intensity={0.4} />
              
              {/* Key light - main illumination */}
              <directionalLight
                position={[5, 8, 5]}
                intensity={1.2}
                castShadow
              />
              
              {/* Fill light - soften shadows */}
              <directionalLight
                position={[-5, 5, -5]}
                intensity={0.5}
              />
              
              {/* Rim light - edge definition */}
              <directionalLight
                position={[0, 5, -10]}
                intensity={0.3}
              />
              
              {/* Point lights for highlights */}
              <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
              <pointLight position={[-10, -5, -10]} intensity={0.2} color="#4f46e5" />
              
              {/* Spot light from top */}
              <spotLight
                position={[0, 15, 0]}
                intensity={0.6}
                castShadow
              />

              {/* 3D Model */}
              <ProductModel 
                productId={product.id}
                product={product}
                color={productColor}
                rotation={autoRotate}
              />

              {/* Realistic contact shadows */}
              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.5}
                scale={15}
                blur={2}
                far={4}
              />

              {/* Studio environment with HDR lighting */}
              <Environment preset="studio" />

              {/* Controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={1.5}
                minDistance={4}
                maxDistance={12}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          </div>

          {/* Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="text-3xl font-bold text-primary-400">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-sm text-gray-300">
                    🖱️ Drag to rotate
                  </p>
                  <p className="text-sm text-gray-300">
                    🔍 Scroll to zoom
                  </p>
                  <p className="text-sm text-gray-300">
                    ✋ Right-click to pan
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Photorealistic 3D model • {product.brand || 'Premium Quality'}
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    // This will be handled by parent component
                    onClose()
                  }}
                  className="btn-secondary px-6 py-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default Product3DViewer
