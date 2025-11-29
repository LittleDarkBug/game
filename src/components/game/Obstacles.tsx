import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'

const COUNT = 20
const SPEED_MULTIPLIER = 1
const SPAWN_DISTANCE = -50
const TUNNEL_RADIUS = 4
const NEAR_MISS_THRESHOLD = 1.5 // Increased for 3D distance check

export const Obstacles = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    const { speed, tunnelRotation, isPlaying, endGame, increaseScore, gameId, magnetPoint, combo } = useGameStore()
    const incrementCombo = useGameStore((state) => state.incrementCombo)
    const resetCombo = useGameStore((state) => state.resetCombo)
    const incrementNearMiss = useGameStore((state) => state.incrementNearMiss)
    const increaseDistance = useGameStore((state) => state.increaseDistance)

    const lastComboReset = useRef(0)

    const data = useMemo(() => {
        return new Array(COUNT).fill(0).map((_, i) => ({
            z: SPAWN_DISTANCE - (i * 10),
            angle: Math.random() * Math.PI * 2,
            nearMissTriggered: false
        }))
    }, [])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useMemo(() => {
        data.forEach((item) => {
            item.z = SPAWN_DISTANCE - Math.random() * 50
            item.angle = Math.random() * Math.PI * 2
            item.nearMissTriggered = false
        })
    }, [gameId, data])

    useFrame((_state, delta) => {
        if (!meshRef.current || !isPlaying) return

        // Rotate the entire group to match tunnel rotation
        if (groupRef.current) {
            groupRef.current.rotation.z = -tunnelRotation
        }

        const moveDist = speed * delta * SPEED_MULTIPLIER
        let collision = false

        increaseDistance(moveDist)

        if (Date.now() - lastComboReset.current > 3000) {
            resetCombo()
            lastComboReset.current = Date.now()
        }

        const playerPos = useGameStore.getState().playerPositionRef

        data.forEach((item, i) => {
            item.z += moveDist

            if (item.z > 5) {
                item.z = SPAWN_DISTANCE
                item.angle = Math.random() * Math.PI * 2
                item.nearMissTriggered = false
                increaseScore(10)
            }

            const x = Math.cos(item.angle) * TUNNEL_RADIUS
            const y = Math.sin(item.angle) * TUNNEL_RADIUS

            // Slight pulse near magnet
            let scale = 1
            if (magnetPoint?.active && item.z > -5 && item.z < 5) {
                // We need world position of obstacle to check distance to magnet
                // Obstacle world pos = (x,y) rotated by -tunnelRotation
                const angle = item.angle - tunnelRotation
                const wx = Math.cos(angle) * TUNNEL_RADIUS
                const wy = Math.sin(angle) * TUNNEL_RADIUS

                const mx = magnetPoint.position.x
                const my = magnetPoint.position.y
                const dist = Math.sqrt((wx - mx) ** 2 + (wy - my) ** 2)
                if (dist < 3) {
                    scale = 1 + (3 - dist) * 0.15
                }
            }

            dummy.position.set(x, y, item.z)
            dummy.rotation.z = item.angle - Math.PI / 2
            dummy.scale.set(scale, scale, scale)
            dummy.updateMatrix()
            meshRef.current!.setMatrixAt(i, dummy.matrix)

            // Collision Detection
            if (item.z > -1.5 && item.z < 1.5) {
                // Calculate Obstacle World Position
                const angle = item.angle - tunnelRotation
                const wx = Math.cos(angle) * TUNNEL_RADIUS
                const wy = Math.sin(angle) * TUNNEL_RADIUS

                // Calculate distance to player
                const dx = playerPos.x - wx
                const dy = playerPos.y - wy
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < 1.2) { // Hit box size
                    collision = true
                } else if (dist < NEAR_MISS_THRESHOLD && !item.nearMissTriggered) { // Near miss radius
                    item.nearMissTriggered = true
                    incrementCombo()
                    incrementNearMiss()
                    lastComboReset.current = Date.now()
                }
            }
        })

        meshRef.current.instanceMatrix.needsUpdate = true

        if (collision) {
            endGame()
        }
    })

    return (
        <group ref={groupRef}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial
                    color="#ff0055"
                    emissive="#ff0055"
                    emissiveIntensity={combo > 1 ? 3 : 2}
                    toneMapped={false}
                />
            </instancedMesh>
        </group>
    )
}
