import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'

export const Tunnel = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const tunnelRotation = useGameStore((state) => state.tunnelRotation)
    const combo = useGameStore((state) => state.combo)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.z = -tunnelRotation
        }
    })

    // Dynamic color based on combo
    const color = combo > 3 ? '#ff00ff' : combo > 1 ? '#00ffff' : '#00aaff'

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[5, 5, 60, 32, 1, true]} />
            <meshBasicMaterial
                color={color}
                wireframe
                transparent
                opacity={0.15}
                side={THREE.BackSide}
            />
        </mesh>
    )
}
