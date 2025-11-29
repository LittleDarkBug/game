import { create } from 'zustand'
import * as THREE from 'three'

export type GameState = 'splash' | 'tutorial' | 'menu' | 'playing' | 'paused' | 'gameover'

interface MagnetPoint {
    position: THREE.Vector3
    active: boolean
    createdAt: number
}

interface GameStore {
    // Game State
    gameState: GameState
    isPlaying: boolean
    isGameOver: boolean
    isPaused: boolean

    // Score & Progress
    score: number
    distance: number
    speed: number
    combo: number
    maxCombo: number
    nearMisses: number
    highScores: number[]

    // Controls
    tunnelRotation: number
    magnetPoint: MagnetPoint | null
    energy: number
    setEnergy: (energy: number) => void
    playerPositionRef: THREE.Vector3 // Mutable ref for physics loop access

    // Tutorial
    tutorialStep: number
    tutorialCompleted: boolean

    // Game cycle ID for resets
    gameId: number

    // Actions
    setGameState: (state: GameState) => void
    startGame: () => void
    endGame: () => void
    pauseGame: () => void
    resumeGame: () => void
    resetGame: () => void

    increaseScore: (amount: number) => void
    increaseDistance: (amount: number) => void
    setSpeed: (speed: number) => void
    setTunnelRotation: (rotation: number) => void

    setMagnetPoint: (point: MagnetPoint | null) => void
    incrementCombo: () => void
    resetCombo: () => void
    incrementNearMiss: () => void

    nextTutorialStep: () => void
    skipTutorial: () => void

    saveHighScore: () => void
    loadHighScores: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial State
    gameState: 'splash',
    isPlaying: false,
    isGameOver: false,
    isPaused: false,

    score: 0,
    distance: 0,
    speed: 10,
    combo: 1,
    maxCombo: 1,
    nearMisses: 0,
    highScores: [],

    tunnelRotation: 0,
    magnetPoint: null,
    energy: 100,
    playerPositionRef: new THREE.Vector3(0, 0, 0),

    tutorialStep: 0,
    tutorialCompleted: false,

    gameId: 0,

    // Game State Actions
    setGameState: (state) => set({ gameState: state }),

    startGame: () => set((state) => ({
        isPlaying: true,
        isGameOver: false,
        isPaused: false,
        gameState: 'playing',
        score: 0,
        distance: 0,
        combo: 1,
        maxCombo: 1,
        nearMisses: 0,
        speed: 10,
        tunnelRotation: 0,
        magnetPoint: null,
        energy: 100,
        gameId: state.gameId + 1
    })),

    endGame: () => {
        get().saveHighScore()
        set({ isPlaying: false, isGameOver: true, gameState: 'gameover', isPaused: false })
    },

    pauseGame: () => set({ isPaused: true, gameState: 'paused' }),

    resumeGame: () => set({ isPaused: false, gameState: 'playing' }),

    resetGame: () => set((state) => ({
        isPlaying: false,
        isGameOver: false,
        isPaused: false,
        gameState: state.tutorialCompleted ? 'menu' : 'tutorial',
        score: 0,
        distance: 0,
        combo: 1,
        maxCombo: 1,
        nearMisses: 0,
        speed: 10,
        tunnelRotation: 0,
        magnetPoint: null,
        energy: 100,
        gameId: state.gameId + 1
    })),

    // Score Actions
    increaseScore: (amount) => set((state) => ({
        score: state.score + (amount * state.combo)
    })),

    increaseDistance: (amount) => set((state) => {
        const newDistance = state.distance + amount
        // Dynamic Difficulty: Increase speed by 0.5 every 50 meters, capped at 25
        const newSpeed = Math.min(25, 10 + Math.floor(newDistance / 50) * 0.5)

        return {
            distance: newDistance,
            speed: newSpeed
        }
    }),

    setSpeed: (speed) => set({ speed }),

    setTunnelRotation: (rotation) => set({ tunnelRotation: rotation }),

    // Magnet Actions
    setMagnetPoint: (point) => set({ magnetPoint: point }),

    // Energy Actions
    setEnergy: (energy) => set({ energy: Math.max(0, Math.min(100, energy)) }),

    // Combo Actions
    incrementCombo: () => set((state) => {
        const newCombo = state.combo + 1
        return {
            combo: newCombo,
            maxCombo: Math.max(state.maxCombo, newCombo)
        }
    }),

    resetCombo: () => set({ combo: 1 }),

    incrementNearMiss: () => set((state) => ({
        nearMisses: state.nearMisses + 1
    })),

    // Tutorial Actions
    nextTutorialStep: () => set((state) => {
        const nextStep = state.tutorialStep + 1
        if (nextStep >= 4) {
            return {
                tutorialStep: 0,
                tutorialCompleted: true,
                gameState: 'menu'
            }
        }
        return { tutorialStep: nextStep }
    }),

    skipTutorial: () => set({
        tutorialStep: 0,
        tutorialCompleted: true,
        gameState: 'menu'
    }),

    // High Score Actions
    saveHighScore: () => {
        const { score, highScores } = get()
        const newScores = [...highScores, score]
            .sort((a, b) => b - a)
            .slice(0, 5) // Limit to Top 5

        set({ highScores: newScores })
        localStorage.setItem('gravitas_highscores', JSON.stringify(newScores))
    },

    loadHighScores: () => {
        try {
            const saved = localStorage.getItem('gravitas_highscores')
            if (saved) {
                const scores = JSON.parse(saved)
                set({ highScores: scores })
            }
        } catch (error) {
            console.error('Failed to load high scores:', error)
        }
    }
}))
