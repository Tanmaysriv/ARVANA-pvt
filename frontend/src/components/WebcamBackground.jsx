import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const WebcamBackground = ({ videoRef }) => {
  const { gl, scene, camera } = useThree()
  const planeRef = useRef(null)
  const textureRef = useRef(null)

  useEffect(() => {
    if (!videoRef?.current) return

    const video = videoRef.current

    // Wait for video to have dimensions
    const checkVideoReady = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setTimeout(checkVideoReady, 100)
        return
      }

      // Create video texture with proper format
      const texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.format = THREE.RGBAFormat
      texture.colorSpace = THREE.SRGBColorSpace
      textureRef.current = texture

      // Calculate aspect ratio
      const aspect = video.videoWidth / video.videoHeight
      const height = 10
      const width = height * aspect

      // Create geometry and material
      const geometry = new THREE.PlaneGeometry(width, height)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false
      })

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = -5
      mesh.name = 'webcam-background'
      planeRef.current = mesh

      // Remove any existing background
      const existing = scene.getObjectByName('webcam-background')
      if (existing) {
        scene.remove(existing)
      }

      // Add new background
      scene.add(mesh)
    }

    checkVideoReady()

    return () => {
      if (planeRef.current) {
        scene.remove(planeRef.current)
        planeRef.current = null
      }
      if (textureRef.current) {
        textureRef.current.dispose()
        textureRef.current = null
      }
    }
  }, [videoRef, scene])

  // Update texture every frame
  useEffect(() => {
    let animationId
    const updateTexture = () => {
      if (textureRef.current && videoRef.current) {
        textureRef.current.needsUpdate = true
      }
      animationId = requestAnimationFrame(updateTexture)
    }

    animationId = requestAnimationFrame(updateTexture)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [videoRef])

  return null
}