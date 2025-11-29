import { useEffect } from 'react'
import { Scene } from './components/game/Scene'
import { TunnelController } from './components/game/TunnelController'
import { AudioController } from './components/game/AudioController'
import { SplashScreen } from './components/ui/SplashScreen'
import { Tutorial } from './components/ui/Tutorial'
import { MainMenu } from './components/ui/MainMenu'
import { GameOver } from './components/ui/GameOver'
import { PauseMenu } from './components/ui/PauseMenu'
import { HUD } from './components/ui/HUD'

function App() {
  // Request fullscreen on any user interaction
  useEffect(() => {
    const requestFullscreen = () => {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // Ignore errors if fullscreen is denied
        })
      }
    }

    // Try on first click/touch
    document.addEventListener('click', requestFullscreen, { once: true })
    document.addEventListener('touchstart', requestFullscreen, { once: true })

    return () => {
      document.removeEventListener('click', requestFullscreen)
      document.removeEventListener('touchstart', requestFullscreen)
    }
  }, [])

  return (
    <div id="canvas-container">
      <Scene />
      <TunnelController />
      <AudioController />

      <SplashScreen />
      <Tutorial />
      <MainMenu />
      <GameOver />
      <PauseMenu />
      <HUD />
    </div>
  )
}

export default App
