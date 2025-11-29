import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/GameStore'

const DRAG_THRESHOLD = 10 // pixels - mouvement minimal pour considérer comme rotation

export const TunnelController = () => {
    const setTunnelRotation = useGameStore((state) => state.setTunnelRotation)
    const rotationRef = useRef(0)
    const isDragging = useRef(false)
    const lastX = useRef(0)
    const startX = useRef(0)
    const startY = useRef(0)
    const hasMoved = useRef(false)

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            isDragging.current = true
            lastX.current = e.clientX
            startX.current = e.clientX
            startY.current = e.clientY
            hasMoved.current = false
        }

        const handlePointerUp = () => {
            isDragging.current = false
        }

        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging.current) return

            const deltaX = e.clientX - lastX.current

            // Check if moved enough to be considered a drag (not a tap)
            const totalMovement = Math.sqrt(
                Math.pow(e.clientX - startX.current, 2) +
                Math.pow(e.clientY - startY.current, 2)
            )

            if (totalMovement > DRAG_THRESHOLD) {
                hasMoved.current = true

                // Mark this event as handled for rotation (prevent magnet)
                e.stopPropagation()

                lastX.current = e.clientX

                // Sensitivity factor
                const sensitivity = 0.01
                rotationRef.current += deltaX * sensitivity

                setTunnelRotation(rotationRef.current)
            }
        }

        window.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointerup', handlePointerUp)
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointercancel', handlePointerUp)

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointerup', handlePointerUp)
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointercancel', handlePointerUp)
        }
    }, [setTunnelRotation])

    return null // Logic only component
}
