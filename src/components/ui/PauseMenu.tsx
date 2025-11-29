import { useGameStore } from '../../store/GameStore'

export const PauseMenu = () => {
    const isPaused = useGameStore((state) => state.isPaused)
    const resumeGame = useGameStore((state) => state.resumeGame)
    const resetGame = useGameStore((state) => state.resetGame)
    const score = useGameStore((state) => state.score)
    const highScores = useGameStore((state) => state.highScores)

    if (!isPaused) return null

    const highScore = highScores[0] || 0

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 60
        }}>
            {/* Glassmorphism card */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(2rem, 5vw, 3rem)',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 8px 32px 0 rgba(0, 255, 255, 0.2)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: 'clamp(2rem, 6vw, 3rem)',
                    color: '#00ffff',
                    marginBottom: '1.5rem',
                    textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
                }}>
                    PAUSE
                </h2>

                {/* Score display */}
                <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(0, 255, 255, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 255, 255, 0.3)'
                }}>
                    <div style={{
                        fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '0.5rem'
                    }}>
                        Score Actuel
                    </div>
                    <div style={{
                        fontSize: 'clamp(2rem, 6vw, 3rem)',
                        color: '#00ffff',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    }}>
                        {score.toString().padStart(6, '0')}
                    </div>

                    {highScore > 0 && (
                        <div style={{
                            marginTop: '0.5rem',
                            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                            Meilleur: {highScore.toString().padStart(6, '0')}
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <button
                        onClick={resumeGame}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
                            background: 'linear-gradient(45deg, #00ffff, #0080ff)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            touchAction: 'manipulation',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Reprendre
                    </button>

                    <button
                        onClick={resetGame}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                            background: 'transparent',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            touchAction: 'manipulation',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'
                            e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                        }}
                    >
                        Menu Principal
                    </button>
                </div>
            </div>

            {/* Keyboard hint */}
            <div style={{
                marginTop: '2rem',
                fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                color: 'rgba(255, 255, 255, 0.4)'
            }}>
                Appuyez sur ESC pour reprendre
            </div>
        </div>
    )
}
