import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Nike Air Max 270 - Athletic running shoe with realistic details
export const NikeAirMax = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef} rotation={[0, Math.PI / 4, 0]}>
      {/* Outsole - rubber with tread pattern */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.15, 3.3]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      
      {/* Midsole - foam material */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 3.2]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
      </mesh>
      
      {/* Air Max unit - visible air bubble in heel */}
      <mesh position={[0, 0.1, -1]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.4} 
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      
      {/* Heel counter - structured support */}
      <mesh position={[0, 0.7, -1.4]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.3, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      
      {/* Upper - engineered mesh */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.4, 2.8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Toe box - reinforced area */}
      <mesh position={[0, 0.4, 1.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      
      {/* Nike Swoosh - iconic logo */}
      <group position={[1.15, 0.7, 0.3]}>
        <mesh rotation={[0, 0, -0.4]} castShadow>
          <boxGeometry args={[0.08, 0.6, 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Tongue - padded */}
      <mesh position={[0, 1.2, 0.8]} rotation={[0.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      
      {/* Lacing system */}
      {[0.6, 0.3, 0, -0.3, -0.6].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.6, 1 - i * 0.1, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.15]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          <mesh position={[0.6, 1 - i * 0.1, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.15]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Eyelets - metal */}
      {[0.6, 0.3, 0, -0.3, -0.6].map((z, i) => (
        <group key={`eyelet-${i}`}>
          <mesh position={[-0.7, 1 - i * 0.1, z]} castShadow>
            <torusGeometry args={[0.05, 0.02, 8, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.7, 1 - i * 0.1, z]} castShadow>
            <torusGeometry args={[0.05, 0.02, 8, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      ))}
      
      {/* Pull tab */}
      <mesh position={[0, 1.3, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.3, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      
      {/* Nike branding on tongue */}
      <mesh position={[0, 1.4, 0.95]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.02]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  )
}

// Adidas Ultraboost - Premium running shoe
export const AdidasUltraboost = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Boost sole */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.1, 0.5, 3.1]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.8} />
      </mesh>
      {/* Primeknit upper */}
      <mesh position={[0, 0.7, -0.1]} castShadow>
        <boxGeometry args={[1.9, 1.1, 2.6]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Heel counter */}
      <mesh position={[0, 0.6, -1.3]} castShadow>
        <boxGeometry args={[2, 1, 0.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Three stripes */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[1.05, 0.5, x]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.05, 0.6, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

// Converse Chuck Taylor - Classic canvas sneaker
export const ConverseChuckTaylor = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Rubber sole */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.3, 3]} />
        <meshStandardMaterial color="#f9fafb" roughness={0.7} />
      </mesh>
      {/* Canvas upper */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.1, 1.2, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Ankle patch */}
      <mesh position={[1, 0.8, -1]} castShadow>
        <circleGeometry args={[0.3, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Toe cap */}
      <mesh position={[0, 0.2, 1.3]} castShadow>
        <sphereGeometry args={[0.6, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#f9fafb" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Leather Tote Bag
export const LeatherToteBag = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 3.5, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Bottom gusset */}
      <mesh position={[0, -1.75, 0]} castShadow>
        <boxGeometry args={[3, 0.2, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Handles */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.2, 0]} castShadow>
            <torusGeometry args={[0.3, 0.08, 8, 16, Math.PI]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Stitching detail */}
      <mesh position={[0, 0, 0.91]} castShadow>
        <boxGeometry args={[2.8, 3.3, 0.02]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  )
}

// Designer Backpack
export const DesignerBackpack = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main compartment */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.5, 3.5, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Front pocket */}
      <mesh position={[0, 0.5, 0.7]} castShadow>
        <boxGeometry args={[2.2, 2, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Laptop compartment padding */}
      <mesh position={[0, 0, -0.65]} castShadow>
        <boxGeometry args={[2.3, 3.2, 0.1]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      {/* Shoulder straps */}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0, -0.7]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 4, 0.15]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>
      ))}
      {/* Top handle */}
      <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.4, 0.08, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
    </group>
  )
}

// Crossbody Bag
export const CrossbodyBag = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 1.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Flap */}
      <mesh position={[0, 0.85, 0.1]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.2, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Buckle */}
      <mesh position={[0, 0.7, 0.5]} castShadow>
        <torusGeometry args={[0.15, 0.05, 8, 16]} />
        <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Strap attachment */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Classic White T-Shirt
export const ClassicTShirt = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 3.5, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left sleeve */}
      <mesh position={[-2.1, 0.8, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[1.5, 0.9, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Right sleeve */}
      <mesh position={[2.1, 0.8, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[1.5, 0.9, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

// Denim Jacket
export const DenimJacket = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 3, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Left front panel */}
      <mesh position={[-0.5, 0, 0.25]} castShadow>
        <boxGeometry args={[1, 2.8, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Right front panel */}
      <mesh position={[0.5, 0, 0.25]} castShadow>
        <boxGeometry args={[1, 2.8, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Sleeves */}
      {[-2.2, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, i === 0 ? -0.3 : 0.3]} castShadow>
          <boxGeometry args={[1.2, 2.5, 0.4]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
      {/* Collar */}
      <mesh position={[0, 1.7, 0.1]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.4, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Buttons */}
      {[0.8, 0.2, -0.4, -1].map((y, i) => (
        <mesh key={i} position={[0, y, 0.45]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#4b5563" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Summer Dress
export const SummerDress = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Bodice */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2.5, 2, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Skirt - flowy */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <coneGeometry args={[2.5, 3, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Straps */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 2.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {/* Waistband */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[1.3, 0.08, 8, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  )
}

// Smart Watch Pro
export const SmartWatchPro = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Watch case */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.21]} castShadow>
        <boxGeometry args={[1.1, 1.4, 0.02]} />
        <meshStandardMaterial color="#1f2937" roughness={0.1} metalness={0.9} emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      {/* Digital crown */}
      <mesh position={[0.65, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Band segments */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.3, 1, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// Classic Analog Watch
export const ClassicAnalogWatch = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Watch face */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.3, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Dial */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#f9fafb" roughness={0.3} />
      </mesh>
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI) / 6
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.85, 0.16, Math.cos(angle) * 0.85]}
            castShadow
          >
            <boxGeometry args={[0.05, 0.02, 0.15]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        )
      })}
      {/* Bezel */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[1.1, 0.08, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} />
      </mesh>
      {/* Leather band */}
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.25, 0.8, 0.5]} />
          <meshStandardMaterial color="#8b4513" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Sport Watch
export const SportWatch = ({ color, rotation }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current && rotation) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {/* Watch case - rugged design */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.5, 8]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Digital display */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 1, 0.02]} />
        <meshStandardMaterial color="#1f2937" emissive="#10b981" emissiveIntensity={0.4} />
      </mesh>
      {/* Protective bezel */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[1.3, 0.15, 8, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      {/* Buttons */}
      {[0.4, -0.4].map((y, i) => (
        <mesh key={i} position={[1.4, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.3]} />
          <meshStandardMaterial color="#4b5563" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      {/* Rubber band */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
