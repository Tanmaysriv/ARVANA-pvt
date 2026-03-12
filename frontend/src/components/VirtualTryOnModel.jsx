import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const VirtualTryOnModel = ({
  product,
  poseKeypoints,
  category,
  modelComponent: ModelComponent,
  adjustments = { scale: 1, offsetX: 0, offsetY: 0, offsetZ: 0 }
}) => {
  const groupRef = useRef()
  const modelRef = useRef()

  // Helper to convert color names to hex
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#1f1f1f',
      'white': '#ffffff',
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#00ff00',
      'yellow': '#ffff00',
      'gray': '#808080',
      'grey': '#808080',
      'purple': '#800080'
    }
    if (!colorName) return '#888888'
    return colorMap[colorName.toLowerCase()] || '#888888'
  }

  const modelColor = product?.color 
    ? getColorHex(product.color)
    : (product?.colors?.[0] ? getColorHex(product.colors[0]) : '#888888')

  // Helper to get keypoint by name from array
  const getKeypointByName = (keypoints, name) => {
    if (!keypoints || !Array.isArray(keypoints)) return null
    return keypoints.find(kp => kp.name === name)
  }

  // Position model based on category
  useEffect(() => {
    if (!groupRef.current) return

    let position = new THREE.Vector3(0, -0.5, -3) // Default center, slightly lower

    if (poseKeypoints && Array.isArray(poseKeypoints) && poseKeypoints.length > 0) {
      switch (category) {
        case 'clothes':
          // Get shoulder keypoints for upper body
          const leftShoulder = getKeypointByName(poseKeypoints, 'left_shoulder')
          const rightShoulder = getKeypointByName(poseKeypoints, 'right_shoulder')

          if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
            // Center between shoulders
            const centerX = ((leftShoulder.x + rightShoulder.x) / 2 - 0.5) * 8
            const centerY = (-(leftShoulder.y + rightShoulder.y) / 2 + 0.2) * 8
            position.set(centerX + adjustments.offsetX, centerY + adjustments.offsetY, -2.5 + adjustments.offsetZ)
          } else {
            // Fallback: center screen, slightly lower
            position.set(adjustments.offsetX, adjustments.offsetY - 0.8, -2.5 + adjustments.offsetZ)
          }
          break

        case 'shoes':
          const leftAnkle = getKeypointByName(poseKeypoints, 'left_ankle')

          if (leftAnkle && leftAnkle.score > 0.5) {
            const ankleX = (leftAnkle.x - 0.5) * 8
            const ankleY = -(leftAnkle.y - 0.9) * 8
            position.set(ankleX + adjustments.offsetX, ankleY + adjustments.offsetY, -1.5 + adjustments.offsetZ)
          }
          break

        case 'watches':
          const leftWrist = getKeypointByName(poseKeypoints, 'left_wrist')
          if (leftWrist && leftWrist.score > 0.5) {
            const wristX = (leftWrist.x - 0.5) * 8
            const wristY = -(leftWrist.y - 0.5) * 8
            position.set(wristX + adjustments.offsetX, wristY + adjustments.offsetY, -0.5 + adjustments.offsetZ)
          }
          break

        case 'bags':
          const hipLeft = getKeypointByName(poseKeypoints, 'left_hip')
          if (hipLeft && hipLeft.score > 0.5) {
            const hipX = (hipLeft.x - 0.3) * 8
            const hipY = -(hipLeft.y - 0.5) * 8
            position.set(hipX + adjustments.offsetX, hipY + adjustments.offsetY, -2 + adjustments.offsetZ)
          }
          break

        default:
          position.set(adjustments.offsetX, adjustments.offsetY - 0.5, -3 + adjustments.offsetZ)
      }
    }

    groupRef.current.position.copy(position)
    // Increase default scale for better visibility
    const scale = Math.max(0.8, adjustments.scale)
    groupRef.current.scale.setScalar(scale)
  }, [poseKeypoints, category, adjustments])

  // Smooth animations
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Gentle rotation
      modelRef.current.rotation.y += delta * 0.2
      // Subtle floating
      modelRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.005
    }
  })

  if (!ModelComponent) {
    console.warn('No model component provided')
    // Render a fallback cube for debugging
    return (
      <group ref={groupRef} position={[0, 0, -3]}>
        <mesh>
          <boxGeometry args={[1.5, 2, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <ModelComponent
        color={modelColor}
        rotation={false}
      />
    </group>
  )
}