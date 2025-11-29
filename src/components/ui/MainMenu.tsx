import { useState } from 'react'
import { useGameStore } from '../../store/GameStore'

export const MainMenu = () => {
    const gameState = useGameStore((state) => state.gameState)
    const startGame = useGameStore((state) => state.startGame)
    const setGameState = useGameStore((state) => state.setGameState)
    const highScores = useGameStore((state) => state.highScores)

    const [showLeaderboard, setShowLeaderboard] = useState(false)

    if (gameState !== 'menu') return null

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
            background: 'radial-gradient(circle at center, #1a0a2e 0%, #000000 100%)',
            overflow: 'hidden',
            zIndex: 40
        }}>
            {/* Gravity Well Effect - Fixed to cover screen */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'max(100vw, 100vh)',
                height: 'max(100vw, 100vh)',
                background: 'radial-gradient(circle, rgba(0,255,255,0.05) 0%, transparent 70%)',
                animation: 'pulse-gravity 4s ease-in-out infinite',
                pointerEvents: 'none'
            }} />

            {/* Spiraling Particles */}
            <div style={{
                position: 'absolute',
                inset: 0,
                perspective: '1000px',
                pointerEvents: 'none'
            }}>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '4px',
                            height: '4px',
                            background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                            borderRadius: '50%',
                            boxShadow: `0 0 10px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`,
                            animation: `spiral-in ${3 + Math.random() * 4}s linear infinite`,
                            animationDelay: `-${Math.random() * 5}s`,
                            opacity: 0
                        }}
                    />
                ))}
            </div>

            <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, width: '100%', maxWidth: '600px', padding: '20px' }}>

                {!showLeaderboard ? (
                    <>
                        {/* Title with Glitch/Distortion Effect */}
                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <h1 style={{
                                fontSize: 'clamp(3rem, 12vw, 6rem)',
                                fontWeight: 900,
                                margin: 0,
                                color: 'transparent',
                                WebkitTextStroke: '2px rgba(0, 255, 255, 0.8)',
                                textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                                letterSpacing: '0.1em',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                GRAVITAS
                                <span style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    color: '#ff00ff',
                                    opacity: 0.5,
                                    mixBlendMode: 'screen',
                                    animation: 'glitch-anim 3s infinite linear alternate-reverse',
                                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                                    transform: 'translate(-2px, -2px)'
                                }}>GRAVITAS</span>
                                <span style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    color: '#00ffff',
                                    opacity: 0.5,
                                    mixBlendMode: 'screen',
                                    animation: 'glitch-anim 2s infinite linear alternate-reverse',
                                    clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)',
                                    transform: 'translate(2px, 2px)'
                                }}>GRAVITAS</span>
                            </h1>

                            <p style={{
                                fontSize: 'clamp(0.6rem, 2.5vw, 1.2rem)',
                                color: '#fff',
                                marginTop: '1rem',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                opacity: 0.8,
                                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                            }}>
                                Rotation • Attraction • Survie
                            </p>
                        </div>

                        {/* High Score Display */}
                        {highScore > 0 && (
                            <div style={{
                                marginBottom: '3rem',
                                padding: '1rem 2.5rem',
                                background: 'rgba(0, 0, 0, 0.6)',
                                border: '1px solid rgba(0, 255, 255, 0.3)',
                                borderRadius: '4px',
                                boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                transform: 'skewX(-10deg)'
                            }}>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    marginBottom: '0.2rem',
                                    letterSpacing: '2px',
                                    transform: 'skewX(10deg)'
                                }}>
                                    RECORD ACTUEL
                                </div>
                                <div style={{
                                    fontSize: '2rem',
                                    color: '#00ffff',
                                    fontFamily: 'monospace',
                                    fontWeight: 'bold',
                                    textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                                    transform: 'skewX(10deg)'
                                }}>
                                    {highScore.toString().padStart(6, '0')}
                                </div>
                            </div>
                        )}

                        {/* Menu Buttons */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: '400px',
                            margin: '0 auto'
                        }}>
                            <MenuButton onClick={startGame} primary>
                                COMMENCER
                            </MenuButton>

                            <MenuButton onClick={() => setGameState('tutorial')}>
                                TUTORIEL
                            </MenuButton>

                            <MenuButton onClick={() => setShowLeaderboard(true)}>
                                CLASSEMENT
                            </MenuButton>
                        </div>
                    </>
                ) : (
                    /* Leaderboard View */
                    <div style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 255, 255, 0.2)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <h2 style={{
                            fontSize: '2rem',
                            color: '#00ffff',
                            marginBottom: '2rem',
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                            textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
                        }}>
                            Classement
                        </h2>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginBottom: '2rem',
                            maxHeight: '50vh',
                            overflowY: 'auto',
                            paddingRight: '10px'
                        }}>
                            {highScores.length === 0 ? (
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                                    Aucun score enregistré
                                </div>
                            ) : (
                                highScores.map((score, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: index === 0 ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                        border: index === 0 ? '1px solid rgba(0, 255, 255, 0.3)' : '1px solid transparent',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color: index === 0 ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                                                width: '30px'
                                            }}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <span style={{
                                            fontSize: '1.5rem',
                                            fontFamily: 'monospace',
                                            color: index === 0 ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                                            textShadow: index === 0 ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
                                        }}>
                                            {score.toString().padStart(6, '0')}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <MenuButton onClick={() => setShowLeaderboard(false)}>
                            RETOUR
                        </MenuButton>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes pulse-gravity {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        @keyframes spiral-in {
          0% {
            transform: rotate(0deg) translateX(50vw) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(0) scale(1);
            opacity: 0;
          }
        }

        @keyframes glitch-anim {
          0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(92% 0 1% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, 2px); }
          100% { clip-path: inset(58% 0 43% 0); transform: translate(2px, -2px); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    )
}

// Reusable Button Component
const MenuButton = ({ children, onClick, primary = false }: { children: React.ReactNode, onClick: () => void, primary?: boolean }) => (
    <button
        onClick={onClick}
        style={{
            position: 'relative',
            width: '100%',
            padding: '1.2rem',
            fontSize: primary ? '1.5rem' : '1.1rem',
            background: primary
                ? 'linear-gradient(90deg, rgba(0,255,255,0.1), rgba(0,255,255,0.2), rgba(0,255,255,0.1))'
                : 'transparent',
            border: `1px solid ${primary ? '#00ffff' : 'rgba(255,255,255,0.2)'}`,
            color: primary ? '#00ffff' : 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
            fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = primary ? 'rgba(0,255,255,0.3)' : 'rgba(255,255,255,0.1)'
            e.currentTarget.style.letterSpacing = '0.3em'
            e.currentTarget.style.boxShadow = `0 0 20px ${primary ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = primary
                ? 'linear-gradient(90deg, rgba(0,255,255,0.1), rgba(0,255,255,0.2), rgba(0,255,255,0.1))'
                : 'transparent'
            e.currentTarget.style.letterSpacing = '0.2em'
            e.currentTarget.style.boxShadow = 'none'
        }}
    >
        {children}
    </button>
)
