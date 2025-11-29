import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'
import { Line } from '@react-three/drei'

export const MagneticLine = () => {
    const magnetPoint = useGameStore((state) => state.magnetPoint)
    const playerPos = useRef(new THREE.Vector3(0, -3, 0))

    // Track player position from DOM
    useFrame(() => {
        // Get player mesh from scene (hacky but works for now)
        const scene = document.querySelector('canvas')
        if (scene) {
            // We'll update this properly later with refs
            // For now, assume player is at default position
        }
    })

    const points = useMemo(() => {
        if (!magnetPoint?.active) return []
        return [
            playerPos.current,
            magnetPoint.position
        ]
    }, [magnetPoint])

    if (!magnetPoint?.active) return null

    return (
        <>
            {/* Line from player to magnet point */}
            <Line
                points={points}
                color="#00ffff"
                lineWidth={2}
                transparent
                opacity={0.8}
            />

            {/* Magnet point indicator */}
            <group position={magnetPoint.position}>
                <mesh>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        transparent
                        opacity={0.6}
                    />
                </mesh>

                {/* Pulsing ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.2, 0.25, 32]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>
        </>
    )
}
