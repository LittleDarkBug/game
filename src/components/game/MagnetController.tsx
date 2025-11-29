import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/GameStore'

const MAGNET_DURATION = 2000 // 2 seconds

export const MagnetController = () => {
    const { camera, gl } = useThree()
    const { setMagnetPoint, isPlaying, magnetPoint } = useGameStore()

    useEffect(() => {
        if (!isPlaying) return

        let pointerDownX = 0
        let pointerDownY = 0
        let hasMoved = false

        const MOVE_THRESHOLD = 10 // pixels

        const handlePointerDown = (event: PointerEvent) => {
            pointerDownX = event.clientX
            pointerDownY = event.clientY
            hasMoved = false
        }

        const handlePointerMove = (event: PointerEvent) => {
            const deltaX = Math.abs(event.clientX - pointerDownX)
            const deltaY = Math.abs(event.clientY - pointerDownY)

            if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
                hasMoved = true
            }
        }

        const handlePointerUp = (event: PointerEvent) => {
            // Only activate magnet if it was a tap, not a drag
            if (hasMoved) return

            // Convert screen coordinates to 3D position
            const rect = gl.domElement.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            // Raycast to find 3D position
            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

            // Create a plane at z=0 to intersect with
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
            const intersectPoint = new THREE.Vector3()
            raycaster.ray.intersectPlane(plane, intersectPoint)

            // Limit the magnet point to reasonable bounds (within tunnel radius)
            const maxRadius = 3.5
            const distance = Math.sqrt(intersectPoint.x ** 2 + intersectPoint.y ** 2)
            if (distance > maxRadius) {
                const scale = maxRadius / distance
                intersectPoint.x *= scale
                intersectPoint.y *= scale
            }

            setMagnetPoint({
                position: intersectPoint,
                active: true,
                createdAt: Date.now()
            })
        }

        window.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [camera, gl, setMagnetPoint, isPlaying])

    // Auto-deactivate magnet point after duration
    useEffect(() => {
        if (!magnetPoint?.active) return

        const elapsed = Date.now() - magnetPoint.createdAt
        const remaining = MAGNET_DURATION - elapsed

        if (remaining <= 0) {
            setMagnetPoint(null)
            return
        }

        const timeout = setTimeout(() => {
            setMagnetPoint(null)
        }, remaining)

        return () => clearTimeout(timeout)
    }, [magnetPoint, setMagnetPoint])

    return null
}
