import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'

const MAGNET_STRENGTH = 8
const DAMPING = 0.85
const MAX_VELOCITY = 0.3

export const Player = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const velocity = useRef(new THREE.Vector3(0, 0, 0))
    const currentPosition = useRef(new THREE.Vector3(0, 0, 0)) // Position centrée

    const magnetPoint = useGameStore((state) => state.magnetPoint)
    const isPlaying = useGameStore((state) => state.isPlaying)

    useFrame((state, delta) => {
        if (!meshRef.current) return

        // Bob animation when not playing
        if (!isPlaying) {
            const time = state.clock.elapsedTime
            meshRef.current.position.y = -3 + Math.sin(time * 2) * 0.1
            return
        }

        // Centrifugal Force (Push away from center to prevent camping)
        const distanceFromCenter = Math.sqrt(
            currentPosition.current.x ** 2 +
            currentPosition.current.y ** 2
        )

        // Force increases as you get closer to center (inverse distance)
        // But we want a constant push out
        const centrifugalStrength = 2.0 * delta
        if (distanceFromCenter > 0.1) {
            const pushDir = new THREE.Vector3()
                .copy(currentPosition.current)
                .normalize()
                .multiplyScalar(centrifugalStrength)

            velocity.current.add(pushDir)
        } else {
            // If dead center, push in random direction
            velocity.current.x += (Math.random() - 0.5) * centrifugalStrength
            velocity.current.y += (Math.random() - 0.5) * centrifugalStrength
        }

        // Magnetic attraction physics & Energy System
        const energy = useGameStore.getState().energy
        const setEnergy = useGameStore.getState().setEnergy

        if (magnetPoint?.active) {
            if (energy > 0) {
                // Drain energy
                setEnergy(energy - (30 * delta)) // Drain full in ~3.3 seconds

                const target = magnetPoint.position
                const current = currentPosition.current

                // Calculate direction and distance to magnet point
                const direction = new THREE.Vector3()
                    .subVectors(target, current)

                const distance = direction.length()

                if (distance > 0.1) {
                    // Apply force based on distance (inverse square law for realism)
                    const forceMagnitude = MAGNET_STRENGTH * delta
                    direction.normalize().multiplyScalar(forceMagnitude)

                    // Add to velocity
                    velocity.current.add(direction)
                }
            }
        } else {
            // Regenerate energy
            if (energy < 100) {
                setEnergy(energy + (15 * delta)) // Regenerate full in ~6.6 seconds
            }
        }

        // Apply damping to velocity
        velocity.current.multiplyScalar(DAMPING)

        // Clamp velocity
        if (velocity.current.length() > MAX_VELOCITY) {
            velocity.current.normalize().multiplyScalar(MAX_VELOCITY)
        }

        // Update position
        currentPosition.current.add(velocity.current)

        // Keep player within tunnel bounds (soft constraint)
        const maxRadius = 3.5
        const distance = Math.sqrt(
            currentPosition.current.x ** 2 +
            currentPosition.current.y ** 2
        )

        if (distance > maxRadius) {
            const scale = maxRadius / distance
            currentPosition.current.x *= scale
            currentPosition.current.y *= scale
            velocity.current.multiplyScalar(0.5) // Bounce off walls
        }

        // Apply to mesh
        meshRef.current.position.copy(currentPosition.current)

        // Subtle rotation based on velocity
        meshRef.current.rotation.z = velocity.current.x * -2

        // Update global player position ref for collision detection
        useGameStore.getState().playerPositionRef.copy(currentPosition.current)
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={3}
                toneMapped={false}
            />

            {/* Outer glow ring */}
            <mesh scale={1.5}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                />
            </mesh>
        </mesh>
    )
}
