import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'

const TRAIL_LENGTH = 20

export const PlayerTrail = () => {
    const geometryRef = useRef<THREE.BufferGeometry>(null)
    const isPlaying = useGameStore((state) => state.isPlaying)
    const combo = useGameStore((state) => state.combo)

    const positions = useRef(new Float32Array(TRAIL_LENGTH * 3))
    const playerHistory = useRef<THREE.Vector3[]>([])

    useFrame(() => {
        if (!geometryRef.current || !isPlaying) return

        // Get current player position (we'll approximate it at fixed position for now)
        const currentPos = new THREE.Vector3(0, -3, 0)

        playerHistory.current.unshift(currentPos.clone())
        if (playerHistory.current.length > TRAIL_LENGTH) {
            playerHistory.current.pop()
        }

        // Update positions
        playerHistory.current.forEach((pos, i) => {
            positions.current[i * 3] = pos.x
            positions.current[i * 3 + 1] = pos.y
            positions.current[i * 3 + 2] = pos.z
        })

        geometryRef.current.setAttribute(
            'position',
            new THREE.BufferAttribute(positions.current, 3)
        )
        geometryRef.current.attributes.position.needsUpdate = true
    })

    const color = combo > 3 ? '#ff00ff' : '#00ffff'

    return (
        <line>
            <bufferGeometry ref={geometryRef} />
            <lineBasicMaterial
                color={color}
                transparent
                opacity={0.4}
                linewidth={2}
            />
        </line>
    )
}
