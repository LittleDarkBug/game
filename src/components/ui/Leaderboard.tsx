import { useGameStore } from '../../store/GameStore'

export const LeaderboardModal = () => {
    const highScores = useGameStore((state) => state.highScores)
    const score = useGameStore((state) => state.score)

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 8px 32px 0 rgba(0, 255, 255, 0.2)'
        }}>
            <h2 style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                color: '#00ffff',
                marginBottom: '1.5rem',
                textAlign: 'center',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
            }}>
                MEILLEURS SCORES
            </h2>

            {highScores.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: '2rem',
                    fontSize: 'clamp(1rem, 3vw, 1.2rem)'
                }}>
                    Aucun score enregistré
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                }}>
                    {highScores.map((highScore, index) => {
                        const isCurrentScore = highScore === score
                        const medal = index === 0 ? '★' : index === 1 ? '▲' : index === 2 ? '●' : ''

                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    background: isCurrentScore
                                        ? 'rgba(0, 255, 255, 0.2)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '10px',
                                    border: isCurrentScore
                                        ? '2px solid #00ffff'
                                        : '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <span style={{
                                        fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                                        color: index < 3 ? '#FFD700' : 'rgba(255, 255, 255, 0.6)',
                                        fontWeight: 'bold',
                                        minWidth: '2rem'
                                    }}>
                                        {medal || `${index + 1}.`}
                                    </span>
                                    <span style={{
                                        fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                                        color: '#00ffff',
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold'
                                    }}>
                                        {highScore.toString().padStart(6, '0')}
                                    </span>
                                </div>
                                {isCurrentScore && (
                                    <span style={{
                                        fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                                        color: '#00ffff',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        Nouveau
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
