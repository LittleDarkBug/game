import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'

const COUNT = 150

export const SpeedParticles = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const speed = useGameStore((state) => state.speed)
    const isPlaying = useGameStore((state) => state.isPlaying)
    const combo = useGameStore((state) => state.combo)

    const dummy = new THREE.Object3D()
    const particles = useRef(new Array(COUNT).fill(0).map(() => ({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 12,
        z: Math.random() * -60,
        speed: Math.random() * 0.5 + 0.5,
        size: Math.random() * 0.05 + 0.02
    })))

    useFrame((_state, delta) => {
        if (!meshRef.current) return
        if (!isPlaying) return

        const speedMultiplier = 1 + (combo - 1) * 0.1 // Faster with combo

        particles.current.forEach((particle, i) => {
            particle.z += speed * delta * particle.speed * speedMultiplier * 3

            if (particle.z > 5) {
                particle.z = -60
                particle.x = (Math.random() - 0.5) * 12
                particle.y = (Math.random() - 0.5) * 12
            }

            dummy.position.set(particle.x, particle.y, particle.z)

            // Stretch based on speed
            const stretch = Math.min(speed * 0.3 * speedMultiplier, 8)
            dummy.scale.set(particle.size, particle.size, stretch)

            dummy.updateMatrix()
            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    // Color changes with combo
    const color = combo > 3 ? '#ff00ff' : combo > 1 ? '#00ffff' : '#ffffff'

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.6}
                toneMapped={false}
            />
        </instancedMesh>
    )
}
