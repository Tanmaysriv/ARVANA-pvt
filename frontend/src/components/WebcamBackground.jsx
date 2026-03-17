import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PLANE_Z = -5

export const WebcamBackground = ({ videoRef }) => {
  const { scene, camera, size } = useThree()
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

      // Compute plane size to EXACTLY fill the camera frustum at PLANE_Z
      const dist = camera.position.z - PLANE_Z        // distance = 5 - (-5) = 10
      const vFov = (camera.fov * Math.PI) / 180
      const planeHeight = 2 * Math.tan(vFov / 2) * dist
      const canvasAspect = size.width / size.height
      const planeWidth = planeHeight * canvasAspect

      // Cover-mode UV: preserve video aspect ratio, crop to fill canvas
      const videoAspect = video.videoWidth / video.videoHeight
      const scaleU = Math.min(1, videoAspect / canvasAspect)
      const scaleV = Math.min(1, canvasAspect / videoAspect)
      texture.repeat.set(scaleU, scaleV)
      texture.offset.set((1 - scaleU) / 2, (1 - scaleV) / 2)

      // Create geometry and material
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        toneMapped: false
      })

      // Create mesh
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = PLANE_Z
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
  }, [videoRef, scene, camera, size])

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