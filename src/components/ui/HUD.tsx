import { useEffect } from 'react'
import { useGameStore } from '../../store/GameStore'

export const HUD = () => {
    const score = useGameStore((state) => state.score)
    const combo = useGameStore((state) => state.combo)
    const isPlaying = useGameStore((state) => state.isPlaying)
    const isPaused = useGameStore((state) => state.isPaused)
    const pauseGame = useGameStore((state) => state.pauseGame)
    const magnetPoint = useGameStore((state) => state.magnetPoint)
    const energy = useGameStore((state) => state.energy)

    // ESC key to pause
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPlaying && !isPaused) {
                pauseGame()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPlaying, isPaused, pauseGame])

    if (!isPlaying) return null

    return (
        <>
            {/* Top HUD */}
            <div style={{
                position: 'absolute',
                top: 'max(20px, var(--sat))',
                left: 'max(20px, var(--sal))',
                right: 'max(20px, var(--sar))',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                pointerEvents: 'none',
                zIndex: 10
            }}>
                {/* Score & Distance */}
                <div style={{ textAlign: 'left' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '10px'
                    }}>
                        <div style={{
                            fontSize: 'clamp(2rem, 6vw, 3rem)',
                            color: '#00ffff',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            textShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
                            lineHeight: 1
                        }}>
                            {score.toString().padStart(6, '0')}
                        </div>
                        <div style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            PTS
                        </div>
                    </div>
                </div>

                {/* Pause button */}
                <button
                    onClick={pauseGame}
                    style={{
                        pointerEvents: 'auto',
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        touchAction: 'manipulation',
                        transition: 'all 0.2s'
                    }}
                >
                    ||
                </button>
            </div>

            {/* Energy & Magnet Indicator (Bottom Center) */}
            <div style={{
                position: 'absolute',
                bottom: 'max(30px, var(--sab))',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                pointerEvents: 'none',
                zIndex: 10,
                width: '200px'
            }}>
                {/* Energy Bar */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px'
                }}>
                    <span style={{ fontSize: '0.7rem', color: '#00ffff', fontWeight: 'bold' }}>ÉNERGIE</span>
                    <span style={{ fontSize: '0.7rem', color: '#00ffff', fontWeight: 'bold' }}>{Math.round(energy)}%</span>
                </div>
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${energy}%`,
                        background: energy < 20 ? '#ff0000' : '#00ffff',
                        boxShadow: `0 0 10px ${energy < 20 ? '#ff0000' : '#00ffff'}`,
                        transition: 'width 0.1s linear, background 0.3s'
                    }} />
                </div>

                {/* Magnet Status Text */}
                <div style={{
                    fontSize: '0.7rem',
                    color: magnetPoint?.active ? '#ff00ff' : 'rgba(255, 255, 255, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                    textShadow: magnetPoint?.active ? '0 0 10px #ff00ff' : 'none',
                    marginTop: '5px'
                }}>
                    {magnetPoint?.active ? 'AIMANT ACTIF' : 'APPUYER POUR ACTIVER'}
                </div>
            </div>

            {/* Combo Indicator (Center Screen) */}
            {combo > 1 && (
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                    animation: 'pulse-combo 0.3s ease-in-out'
                }}>
                    <div style={{
                        fontSize: 'clamp(2rem, 8vw, 4rem)',
                        fontWeight: '900',
                        color: '#ff00ff',
                        textShadow: '0 0 20px rgba(255, 0, 255, 0.8)',
                        fontStyle: 'italic',
                        lineHeight: 1
                    }}>
                        x{combo}
                    </div>
                    <div style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        marginTop: '5px'
                    }}>
                        COMBO
                    </div>
                </div>
            )}

            <style>{`
        @keyframes pulse-combo {
          0% { transform: translateX(-50%) scale(1.5); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
        </>
    )
}
