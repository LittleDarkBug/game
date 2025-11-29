import { useGameStore } from '../../store/GameStore'

export const Tutorial = () => {
    const gameState = useGameStore((state) => state.gameState)
    const tutorialStep = useGameStore((state) => state.tutorialStep)
    const nextTutorialStep = useGameStore((state) => state.nextTutorialStep)
    const skipTutorial = useGameStore((state) => state.skipTutorial)

    if (gameState !== 'tutorial') return null

    const steps = [
        {
            title: 'Le Tunnel Tourne',
            description: 'Glissez votre doigt pour faire pivoter tout le tunnel autour de vous',
            icon: '⟲',
            hint: 'Le monde tourne, pas vous'
        },
        {
            title: 'Créez un Point Magnétique',
            description: 'Tapez l\'écran : un point d\'attraction apparaît et vous attire comme un aimant',
            icon: '⊕',
            hint: 'La physique devient votre alliée'
        },
        {
            title: 'Maîtrisez GRAVITAS',
            description: 'Combinez rotation du tunnel et attraction magnétique pour esquiver',
            icon: '◈',
            hint: 'Deux forces, un seul objectif'
        },
        {
            title: 'Système de Combo',
            description: 'Frôlez les obstacles rouges sans les toucher pour augmenter votre multiplicateur',
            icon: '▲',
            hint: 'Le risque paie. Êtes-vous prêt ?'
        }
    ]

    const currentStep = steps[tutorialStep]

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
            background: 'radial-gradient(circle at center, rgba(26, 10, 46, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
            zIndex: 50,
            padding: '2rem'
        }}>
            {/* Background Particles (Simplified) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                opacity: 0.2
            }}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '2px',
                            height: '2px',
                            background: '#00ffff',
                            borderRadius: '50%',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`
                        }}
                    />
                ))}
            </div>

            {/* Step indicator */}
            <div style={{
                position: 'absolute',
                top: 'max(20px, var(--sat))',
                right: 'max(20px, var(--sar))',
                fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
                color: '#00ffff',
                opacity: 0.6,
                fontFamily: 'monospace',
                letterSpacing: '2px'
            }}>
                ÉTAPE {tutorialStep + 1} / {steps.length}
            </div>

            {/* Skip button */}
            <button
                onClick={skipTutorial}
                style={{
                    position: 'absolute',
                    top: 'max(20px, var(--sat))',
                    left: 'max(20px, var(--sal))',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.8rem, 3vw, 1rem)',
                    touchAction: 'manipulation',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
            >
                Passer
            </button>

            {/* Tutorial content card */}
            <div style={{
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%',
                animation: 'fadeIn 0.5s ease-out',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(0, 255, 255, 0.1)',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{
                    fontSize: 'clamp(4rem, 15vw, 6rem)',
                    marginBottom: '1rem',
                    color: '#00ffff',
                    textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                }}>
                    {currentStep.icon}
                </div>

                <h2 style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                    color: '#fff',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}>
                    {currentStep.title}
                </h2>

                <p style={{
                    fontSize: 'clamp(1rem, 4vw, 1.3rem)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.6,
                    marginBottom: '2rem'
                }}>
                    {currentStep.description}
                </p>



                {/* Next button */}
                <button
                    onClick={nextTutorialStep}
                    style={{
                        padding: '1rem 3rem',
                        fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
                        background: 'linear-gradient(90deg, rgba(0,255,255,0.1), rgba(0,255,255,0.2), rgba(0,255,255,0.1))',
                        border: '1px solid #00ffff',
                        color: '#00ffff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        touchAction: 'manipulation',
                        transition: 'all 0.2s',
                        width: '100%',
                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 255, 0.3)'
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(0,255,255,0.1), rgba(0,255,255,0.2), rgba(0,255,255,0.1))'
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.2)'
                    }}
                >
                    {tutorialStep === steps.length - 1 ? 'JOUER' : 'SUIVANT'}
                </button>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    )
}
