import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/GameStore'

export const AudioController = () => {
    const audioContextRef = useRef<AudioContext | null>(null)
    const masterGainRef = useRef<GainNode | null>(null)
    const bgmOscillatorsRef = useRef<OscillatorNode[]>([])

    // Subscribe to store changes
    const isPlaying = useGameStore((state) => state.isPlaying)
    const isGameOver = useGameStore((state) => state.isGameOver)
    const score = useGameStore((state) => state.score)
    const combo = useGameStore((state) => state.combo)
    const magnetActive = useGameStore((state) => state.magnetPoint?.active)

    // Refs for tracking changes to trigger sounds
    const prevScoreRef = useRef(score)
    const prevComboRef = useRef(combo)
    const prevMagnetActiveRef = useRef(magnetActive)

    // Initialize Audio Context
    useEffect(() => {
        const initAudio = () => {
            if (!audioContextRef.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext
                audioContextRef.current = new AudioContext()

                masterGainRef.current = audioContextRef.current.createGain()
                masterGainRef.current.gain.value = 0.3 // Master volume
                masterGainRef.current.connect(audioContextRef.current.destination)
            }

            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume()
            }
        }

        const handleInteraction = () => {
            initAudio()
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('touchstart', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
        }

        window.addEventListener('click', handleInteraction)
        window.addEventListener('touchstart', handleInteraction)
        window.addEventListener('keydown', handleInteraction)

        return () => {
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('touchstart', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
            audioContextRef.current?.close()
        }
    }, [])

    // BGM Management
    useEffect(() => {
        if (!audioContextRef.current || !masterGainRef.current) return

        if (isPlaying && !isGameOver) {
            // Start BGM
            if (bgmOscillatorsRef.current.length === 0) {
                const ctx = audioContextRef.current
                const now = ctx.currentTime

                // Deep drone
                const osc1 = ctx.createOscillator()
                osc1.type = 'sawtooth'
                osc1.frequency.setValueAtTime(55, now) // A1

                const filter1 = ctx.createBiquadFilter()
                filter1.type = 'lowpass'
                filter1.frequency.setValueAtTime(200, now)

                const gain1 = ctx.createGain()
                gain1.gain.setValueAtTime(0, now)
                gain1.gain.linearRampToValueAtTime(0.4, now + 2)

                osc1.connect(filter1)
                filter1.connect(gain1)
                gain1.connect(masterGainRef.current)
                osc1.start()

                // Higher harmony
                const osc2 = ctx.createOscillator()
                osc2.type = 'sine'
                osc2.frequency.setValueAtTime(110, now) // A2

                const gain2 = ctx.createGain()
                gain2.gain.setValueAtTime(0, now)
                gain2.gain.linearRampToValueAtTime(0.2, now + 2)

                osc2.connect(gain2)
                gain2.connect(masterGainRef.current)
                osc2.start()

                bgmOscillatorsRef.current = [osc1, osc2]
            }
        } else {
            // Stop BGM
            bgmOscillatorsRef.current.forEach(osc => {
                try {
                    osc.stop()
                    osc.disconnect()
                } catch (e) { /* ignore */ }
            })
            bgmOscillatorsRef.current = []
        }
    }, [isPlaying, isGameOver])

    // Sound Effects
    useEffect(() => {
        if (!audioContextRef.current || !masterGainRef.current) return
        const ctx = audioContextRef.current
        const now = ctx.currentTime

        // Score Sound
        if (score > prevScoreRef.current) {
            const osc = ctx.createOscillator()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(880, now)
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1)

            const gain = ctx.createGain()
            gain.gain.setValueAtTime(0.3, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

            osc.connect(gain)
            gain.connect(masterGainRef.current)
            osc.start()
            osc.stop(now + 0.3)
        }
        prevScoreRef.current = score

        // Combo Sound
        if (combo > prevComboRef.current) {
            const osc = ctx.createOscillator()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(440 * (1 + (combo * 0.1)), now)

            const gain = ctx.createGain()
            gain.gain.setValueAtTime(0.3, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

            osc.connect(gain)
            gain.connect(masterGainRef.current)
            osc.start()
            osc.stop(now + 0.5)
        }
        prevComboRef.current = combo

        // Magnet Sound
        if (magnetActive && !prevMagnetActiveRef.current) {
            const osc = ctx.createOscillator()
            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(110, now)
            osc.frequency.linearRampToValueAtTime(55, now + 0.5)

            const filter = ctx.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(1000, now)
            filter.frequency.linearRampToValueAtTime(100, now + 0.5)

            const gain = ctx.createGain()
            gain.gain.setValueAtTime(0.4, now)
            gain.gain.linearRampToValueAtTime(0, now + 0.5)

            osc.connect(filter)
            filter.connect(gain)
            gain.connect(masterGainRef.current)
            osc.start()
            osc.stop(now + 0.5)
        }
        prevMagnetActiveRef.current = magnetActive

        // Game Over Sound
        if (isGameOver && !isPlaying) {
            // White noise burst
            const bufferSize = ctx.sampleRate * 1 // 1 second
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1
            }

            const noise = ctx.createBufferSource()
            noise.buffer = buffer

            const filter = ctx.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(1000, now)
            filter.frequency.exponentialRampToValueAtTime(100, now + 1)

            const gain = ctx.createGain()
            gain.gain.setValueAtTime(0.5, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1)

            noise.connect(filter)
            filter.connect(gain)
            gain.connect(masterGainRef.current)
            noise.start()
        }

    }, [score, combo, magnetActive, isGameOver, isPlaying])

    return null
}
