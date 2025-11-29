import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense } from 'react'
import { Tunnel } from './Tunnel'
import { Player } from './Player'
import { Obstacles } from './Obstacles'
import { SpeedParticles } from './SpeedParticles'
import { MagneticLine } from './MagneticLine'
import { MagnetController } from './MagnetController'
import { PlayerTrail } from './PlayerTrail'
import { useGameStore } from '../../store/GameStore'

export const Scene = () => {
    const combo = useGameStore((state) => state.combo)

    // Dynamic colors based on combo
    const bgColor = combo > 3 ? '#1a0a2e' : combo > 1 ? '#0a1a2e' : '#050505'
    const fogColor = combo > 3 ? '#2a0a3e' : combo > 1 ? '#0a2a3e' : '#050505'

    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            dpr={[1, 2]}
        >
            <color attach="background" args={[bgColor]} />
            <fog attach="fog" args={[fogColor, 5, 30]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Suspense fallback={null}>
                <group>
                    <Tunnel />
                    <Player />
                    <Obstacles />
                    <SpeedParticles />
                    <MagneticLine />
                    <PlayerTrail />
                </group>
            </Suspense>

            <MagnetController />

            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.1}
                    mipmapBlur
                    intensity={combo > 1 ? 2.5 : 1.8}
                    radius={0.6}
                />
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL}
                    offset={combo > 3 ? [0.004, 0.004] : [0.002, 0.002]}
                />
                <Vignette
                    offset={0.3}
                    darkness={0.5}
                />
            </EffectComposer>
        </Canvas >
    )
}
