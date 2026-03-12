import '@react-three/fiber'
import { ReactNode } from 'react'

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      children: any
    }
    interface IntrinsicElements {
      group: {
        children?: ReactNode
        position?: [number, number, number] | { x?: number; y?: number; z?: number }
        rotation?: [number, number, number] | { x?: number; y?: number; z?: number }
        scale?: [number, number, number] | { x?: number; y?: number; z?: number }
        castShadow?: boolean
        receiveShadow?: boolean
        ref?: any
        [key: string]: any
      }
      mesh: {
        children?: ReactNode
        position?: [number, number, number] | { x?: number; y?: number; z?: number }
        rotation?: [number, number, number] | { x?: number; y?: number; z?: number }
        scale?: [number, number, number] | { x?: number; y?: number; z?: number }
        castShadow?: boolean
        receiveShadow?: boolean
        ref?: any
        onClick?: (event: any) => void
        [key: string]: any
      }
      meshStandardMaterial: {
        children?: ReactNode
        color?: string | number
        roughness?: number
        metalness?: number
        transparent?: boolean
        opacity?: number
        wireframe?: boolean
        map?: any
        normalMap?: any
        emissive?: string | number
        emissiveIntensity?: number
        ref?: any
        [key: string]: any
      }
      meshPhysicalMaterial: {
        children?: ReactNode
        color?: string | number
        roughness?: number
        metalness?: number
        transmission?: number
        thickness?: number
        transparent?: boolean
        opacity?: number
        ior?: number
        ref?: any
        [key: string]: any
      }
      boxGeometry: {
        args?: [number, number, number, number?, number?, number?]
        ref?: any
        [key: string]: any
      }
      sphereGeometry: {
        args?: [number, number?, number?, number?, number?, number?, number?]
        ref?: any
        [key: string]: any
      }
      cylinderGeometry: {
        args?: [number, number, number, number?, number?, boolean?]
        ref?: any
        [key: string]: any
      }
      torusGeometry: {
        args?: [number, number, number?, number?]
        ref?: any
        [key: string]: any
      }
      planeGeometry: {
        args?: [number, number, number?, number?]
        ref?: any
        [key: string]: any
      }
      coneGeometry: {
        args?: [number, number, number?, number?, number?, number?]
        ref?: any
        [key: string]: any
      }
      ambientLight: {
        children?: ReactNode
        intensity?: number
        color?: string | number
        ref?: any
        [key: string]: any
      }
      directionalLight: {
        children?: ReactNode
        intensity?: number
        position?: [number, number, number]
        castShadow?: boolean
        ref?: any
        [key: string]: any
      }
      pointLight: {
        children?: ReactNode
        intensity?: number
        position?: [number, number, number]
        distance?: number
        decay?: number
        castShadow?: boolean
        ref?: any
        [key: string]: any
      }
      canvas: {
        children?: ReactNode
        [key: string]: any
      }
    }
  }
}

