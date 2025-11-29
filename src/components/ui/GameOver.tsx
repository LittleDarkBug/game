import { useGameStore } from '../../store/GameStore'
import { LeaderboardModal } from './Leaderboard'

export const GameOver = () => {
    const resetGame = useGameStore((state) => state.resetGame)
    const startGame = useGameStore((state) => state.startGame)
    const isGameOver = useGameStore((state) => state.isGameOver)
    const score = useGameStore((state) => state.score)
    const maxCombo = useGameStore((state) => state.maxCombo)
    const nearMisses = useGameStore((state) => state.nearMisses)
    const distance = useGameStore((state) => state.distance)
    const highScores = useGameStore((state) => state.highScores)

    if (!isGameOver) return null

    const isNewRecord = highScores[0] === score && score > 0
    const isTopThree = highScores.indexOf(score) < 3 && highScores.indexOf(score) !== -1

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
            background: 'rgba(20, 0, 10, 0.95)',
            backdropFilter: 'blur(15px)',
            color: 'white',
            zIndex: 50,
            overflowY: 'auto', // Enable scrolling
            overflowX: 'hidden',
            padding: '20px' // Add some padding for safety
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '500px', // Reduced max width
                width: '100%',
                margin: 'auto',
                padding: '1rem 0' // Reduced padding
            }}>
                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(2rem, 6vw, 3rem)', // Reduced size
                    marginBottom: '0.5rem',
                    marginTop: 0,
                    color: '#ff0055',
                    textShadow: '0 0 20px rgba(255, 0, 85, 0.8)',
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    animation: 'shake 0.5s ease-out',
                    lineHeight: 1.1
                }}>
                    {isNewRecord ? 'NOUVEAU RECORD !' : 'CRASH'}
                </h1>

                {/* Main score */}
                <div style={{
                    marginBottom: '1rem', // Reduced margin
                    padding: '0.5rem', // Reduced padding
                    background: 'rgba(255, 0, 85, 0.1)',
                    borderRadius: '15px',
                    border: '2px solid rgba(255, 0, 85, 0.5)',
                    boxShadow: '0 0 20px rgba(255, 0, 85, 0.2)'
                }}>
                    <div style={{
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '0.2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        Score Final
                    </div>
                    <div style={{
                        fontSize: 'clamp(2rem, 8vw, 3.5rem)', // Reduced size
                        color: '#ff0055',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        textShadow: '0 0 20px rgba(255, 0, 85, 0.6)',
                        lineHeight: 1
                    }}>
                        {score.toString().padStart(6, '0')}
                    </div>
                </div>

                {/* Stats grid - Compact */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '5px',
                    marginBottom: '1rem' // Reduced margin
                }}>
                    <div style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Dist.</div>
                        <div style={{ fontSize: '1rem', color: '#00ffff', fontWeight: 'bold' }}>{Math.round(distance)}m</div>
                    </div>

                    <div style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Combo</div>
                        <div style={{ fontSize: '1rem', color: '#ff00ff', fontWeight: 'bold' }}>x{maxCombo}</div>
                    </div>

                    <div style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Misses</div>
                        <div style={{ fontSize: '1rem', color: '#ffff00', fontWeight: 'bold' }}>{nearMisses}</div>
                    </div>
                </div>

                {/* Leaderboard - Only if top 3 */}
                {isTopThree && (
                    <div style={{ marginBottom: '1rem', transform: 'scale(0.9)' }}>
                        <LeaderboardModal />
                    </div>
                )}

                {/* Buttons - Side by Side */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    width: '100%',
                    marginBottom: '0.5rem'
                }}>
                    <button
                        onClick={startGame}
                        style={{
                            flex: 2,
                            padding: '0.8rem',
                            fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                            background: 'linear-gradient(45deg, #ff0055, #ff0099)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            touchAction: 'manipulation'
                        }}
                    >
                        RÉESSAYER
                    </button>

                    <button
                        onClick={resetGame}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            fontSize: 'clamp(0.8rem, 3vw, 1rem)',
                            background: 'transparent',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            touchAction: 'manipulation'
                        }}
                    >
                        MENU
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 0, 85, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 0, 85, 0.8);
        }
      `}</style>
        </div>
    )
}
