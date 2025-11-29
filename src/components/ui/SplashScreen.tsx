import { useEffect } from 'react'
import { useGameStore } from '../../store/GameStore'

export const SplashScreen = () => {
  const gameState = useGameStore((state) => state.gameState)
  const setGameState = useGameStore((state) => state.setGameState)
  const tutorialCompleted = useGameStore((state) => state.tutorialCompleted)
  const loadHighScores = useGameStore((state) => state.loadHighScores)

  useEffect(() => {
    loadHighScores()

    const timer = setTimeout(() => {
      if (tutorialCompleted) {
        setGameState('menu')
      } else {
        setGameState('tutorial')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [tutorialCompleted, setGameState, loadHighScores])

  if (gameState !== 'splash') return null

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
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a2e 100%)',
      zIndex: 100
    }}>
      <div style={{
        animation: 'fadeInScale 1s ease-out',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(4rem, 15vw, 8rem)',
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient 3s ease infinite',
          textShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
          letterSpacing: '0.1em'
        }}>
          GRAVITAS
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          color: '#00ffff',
          marginTop: '1rem',
          opacity: 0.8,
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          Maîtrisez la Gravité
        </p>
      </div>

      <div style={{
        marginTop: '3rem',
        width: '60px',
        height: '60px',
        border: '3px solid rgba(0, 255, 255, 0.2)',
        borderTop: '3px solid #00ffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
