/**
 * Dynamic 3D Model Generator Service
 * Generates procedural 3D models based on product category and attributes
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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
} from '../components/3DModels'

// Generic Box Model - Default fallback
export const GenericBoxModel = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 1.5]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      {/* Border/Edge definition */}
      <mesh position={[0, 0, 0.76]} castShadow>
        <boxGeometry args={[2.1, 2.6, 0.05]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Generic Shoe Model
export const GenericShoeModel = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Sole */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[2, 0.15, 3]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      
      {/* Midsole */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.25, 2.8]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
      </mesh>
      
      {/* Upper */}
      <mesh position={[0, 0.5, -0.3]} castShadow>
        <boxGeometry args={[1.8, 0.9, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      
      {/* Heel counter */}
      <mesh position={[0, 0.3, -1.2]} castShadow>
        <boxGeometry args={[1.9, 0.8, 0.4]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} />
      </mesh>

      {/* Tongue */}
      <mesh position={[0, 0.6, 0.5]} castShadow>
        <boxGeometry args={[1.2, 0.6, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  )
}

// Generic Bag Model
export const GenericBagModel = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 3, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      
      {/* Front pocket */}
      <mesh position={[0, 0.3, 0.65]} castShadow>
        <boxGeometry args={[2.2, 1.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      
      {/* Side panels */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 2.8, 1.1]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Handles/Straps */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 0]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 8]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// Generic Clothing Model (T-Shirt/Jacket)
export const GenericClothesModel = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body/torso */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      
      {/* Left sleeve */}
      <mesh position={[-1.2, 0.8, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      
      {/* Right sleeve */}
      <mesh position={[1.2, 0.8, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      
      {/* Collar */}
      <mesh position={[0, 1.3, 0.3]} castShadow>
        <boxGeometry args={[1.8, 0.3, 0.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      
      {/* Center seam detail */}
      <mesh position={[0, 0, 0.41]} castShadow>
        <boxGeometry args={[1.7, 2.4, 0.05]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
    </group>
  )
}

// Generic Watch Model
export const GenericWatchModel = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Watch face */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      
      {/* Crystal (glass) */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.05, 32]} />
        <meshPhysicalMaterial 
          color="#e0f2fe"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
        />
      </mesh>
      
      {/* Watch band left */}
      <mesh position={[-0.85, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      
      {/* Watch band right */}
      <mesh position={[0.85, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      
      {/* Hour hand */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Minute hand */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.5]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  )
}

// Generic Accessory Model
export const GenericAccessoryModel = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1, 0.25, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  )
}

/**
 * Generate a model component based on product category
 * @param {string} category - Product category (shoes, bags, clothes, watches, accessories, etc.)
 * @returns {React.Component} React component for the 3D model
 */
export const generateDynamicModel = (category) => {
  const categoryMap = {
    shoes: GenericShoeModel,
    bags: GenericBagModel,
    clothes: GenericClothesModel,
    watch: GenericWatchModel,
    watches: GenericWatchModel,
    accessories: GenericAccessoryModel,
    jewellery: GenericAccessoryModel,
    jewelry: GenericAccessoryModel,
  }

  return categoryMap[category?.toLowerCase()] || GenericBoxModel
}

/**
 * Get model configuration for dynamic product
 * Automatically adjust scale and position based on category
 */
export const getModelConfigForCategory = (category) => {
  const configMap = {
    shoes: {
      scale: 1.5,
      position: [0, -0.5, 0],
    },
    bags: {
      scale: 1.2,
      position: [0, -1, 0],
    },
    clothes: {
      scale: 1.3,
      position: [0, -0.5, 0],
    },
    watch: {
      scale: 3,
      position: [0, 0, 0],
    },
    watches: {
      scale: 3,
      position: [0, 0, 0],
    },
    accessories: {
      scale: 2,
      position: [0, 0, 0],
    },
  }

  return configMap[category?.toLowerCase()] || {
    scale: 1,
    position: [0, 0, 0],
  }
}

/**
 * Get the appropriate model component for virtual try-on
 * @param {string} category - Product category
 * @param {number} productId - Product ID (1-11 for predefined models)
 * @returns {React.Component} The model component to render
 */
export const getModelComponent = (category, productId) => {
  // Predefined product IDs (1-11) have specific models
  const PREDEFINED_PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  if (PREDEFINED_PRODUCT_IDS.includes(productId)) {
    // Return the specific model component directly
    const modelMap = {
      1: NikeAirMax,
      2: AdidasUltraboost,
      3: ConverseChuckTaylor,
      4: LeatherToteBag,
      5: CrossbodyBag,
      6: ClassicTShirt,
      7: DenimJacket,
      8: SummerDress,
      9: SmartWatchPro,
      10: ClassicAnalogWatch,
      11: SportWatch
    }

    return modelMap[productId] || GenericBoxModel
  }

  // For new products, use category-based generic models
  return generateDynamicModel(category)
}
