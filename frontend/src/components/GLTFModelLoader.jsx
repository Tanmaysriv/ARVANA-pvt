import { useRef, Suspense } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// GLTF Model Loader Component
export const GLTFModel = ({ url, scale = 1, position = [0, 0, 0], rotation, color }) => {
  const groupRef = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, groupRef)

  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  // Apply color to model if specified
  if (color && scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Clone material to avoid affecting other instances
        child.material = child.material.clone()
        child.material.color = new THREE.Color(color)
      }
    })
  }

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} scale={scale} />
    </group>
  )
}

// Loading fallback component
export const ModelLoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  )
}

// Preload models for better performance
export const preloadModels = (urls) => {
  urls.forEach(url => {
    useGLTF.preload(url)
  })
}
