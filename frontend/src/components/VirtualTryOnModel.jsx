import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_Z = -2.5

export const VirtualTryOnModel = ({
  product,
  poseKeypoints,
  category,
  modelComponent: ModelComponent,
  adjustments = { scale: 1, offsetX: 0, offsetY: 0, offsetZ: 0 }
}) => {
  const groupRef = useRef()
  const { size, camera } = useThree()

  // Convert a normalized keypoint position [0,1] to 3D world coords at MODEL_Z
  // This accounts for camera FOV and canvas aspect ratio correctly
  const keypointToWorld = (nx, ny) => {
    const dist = camera.position.z - MODEL_Z
    const halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * dist
    const halfW = halfH * (size.width / size.height)
    return {
      x: (nx * 2 - 1) * halfW,
      y: -(ny * 2 - 1) * halfH
    }
  }

  // Helper to convert color names to hex
  // Note: white/light colors use a pale-blue tint so they're always visible in AR
  const getColorHex = (colorName) => {
    const colorMap = {
      'black':      '#2a2a2a',
      'white':      '#c8e6ff',   // pale blue-white — visible against any background
      'red':        '#e53e3e',
      'blue':       '#3b82f6',
      'navy':       '#1e3a8a',
      'green':      '#22c55e',
      'yellow':     '#eab308',
      'gray':       '#6b7280',
      'grey':       '#6b7280',
      'purple':     '#a855f7',
      'brown':      '#92400e',
      'tan':        '#d2b48c',
      'silver':     '#94a3b8',
      'gold':       '#f59e0b',
      'rose gold':  '#e879a0',
      'light blue': '#93c5fd',
      'floral':     '#f472b6'
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

    let pos = new THREE.Vector3(0, -0.5, MODEL_Z + adjustments.offsetZ)
    let scale = Math.max(1.0, adjustments.scale)

    if (poseKeypoints && Array.isArray(poseKeypoints) && poseKeypoints.length > 0) {
      switch (category) {
        case 'clothes': {
          const leftShoulder = getKeypointByName(poseKeypoints, 'left_shoulder')
          const rightShoulder = getKeypointByName(poseKeypoints, 'right_shoulder')
          const leftHip = getKeypointByName(poseKeypoints, 'left_hip')
          const rightHip = getKeypointByName(poseKeypoints, 'right_hip')

          if (leftShoulder && rightShoulder && leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
            // Center between shoulders, shifted slightly down onto torso
            const cx = (leftShoulder.x + rightShoulder.x) / 2
            const cy = (leftShoulder.y + rightShoulder.y) / 2 + 0.1
            const w = keypointToWorld(cx, cy)
            pos.set(w.x + adjustments.offsetX, w.y + adjustments.offsetY, MODEL_Z + adjustments.offsetZ)

            // Scale: use torso height if hip visible, else shoulder width
            const dist = camera.position.z - MODEL_Z
            const halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * dist
            const halfW = halfH * (size.width / size.height)

            if (leftHip && leftHip.score > 0.3) {
              const hipY = (leftHip.y + (rightHip?.y ?? leftHip.y)) / 2
              const torsoNorm = Math.abs(cy - hipY)
              scale = torsoNorm * halfH * 2 * 1.3 * adjustments.scale
            } else {
              const shoulderNorm = Math.abs(leftShoulder.x - rightShoulder.x)
              scale = shoulderNorm * halfW * 2 * 1.6 * adjustments.scale
            }
          }
          break
        }

        case 'shoes': {
          const leftAnkle = getKeypointByName(poseKeypoints, 'left_ankle')
          if (leftAnkle && leftAnkle.score > 0.3) {
            const w = keypointToWorld(leftAnkle.x, leftAnkle.y)
            pos.set(w.x + adjustments.offsetX, w.y + adjustments.offsetY, MODEL_Z + adjustments.offsetZ)
            scale = 1.2 * adjustments.scale
          }
          break
        }

        case 'watches': {
          const leftWrist = getKeypointByName(poseKeypoints, 'left_wrist')
          if (leftWrist && leftWrist.score > 0.3) {
            const w = keypointToWorld(leftWrist.x, leftWrist.y)
            pos.set(w.x + adjustments.offsetX, w.y + adjustments.offsetY, MODEL_Z + adjustments.offsetZ)
            scale = 0.7 * adjustments.scale
          }
          break
        }

        case 'bags': {
          const leftHip = getKeypointByName(poseKeypoints, 'left_hip')
          if (leftHip && leftHip.score > 0.3) {
            const w = keypointToWorld(leftHip.x - 0.08, leftHip.y)
            pos.set(w.x + adjustments.offsetX, w.y + adjustments.offsetY, MODEL_Z + adjustments.offsetZ)
            scale = 1.0 * adjustments.scale
          }
          break
        }

        default:
          pos.set(adjustments.offsetX, adjustments.offsetY - 0.5, MODEL_Z + adjustments.offsetZ)
      }
    }

    groupRef.current.position.copy(pos)
    groupRef.current.scale.setScalar(Math.max(0.5, scale))
  }, [poseKeypoints, category, adjustments, size, camera])

  // Subtle floating animation only (no auto-rotation - that interferes with AR alignment)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.001
    }
  })

  if (!ModelComponent) {
    console.warn('No model component provided')
    // Render a fallback cube for debugging
    return (
      <group ref={groupRef} position={[0, 0, MODEL_Z]}>
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