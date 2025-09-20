import { useEffect, useState } from 'react'
import { Board } from './Board'
import ActionMenu from './components/ActionMenu'
import { EndGameScreen } from './components/EndGameScreen'
import { PlayerInfo } from './components/PlayerInfo'
import { WaitingSplashScreen } from './components/WaitingSplashScreen'
import { useIsGameEnded, usePlayers } from './hooks/stateHooks'
import { getUniqueColor } from './utils/colors'

export function BaseGame() {
  const players = usePlayers()
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const isMobile = width < 768
  const gameEnded = useIsGameEnded()
  const [examiningBoard, setExaminingBoard] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Show splash screen only while waiting for players to join
  const shouldShowSplashScreen = players.length < 2

  if (shouldShowSplashScreen) {
    return <WaitingSplashScreen maxPlayers={2} />
  }

  // Calculate dynamic heights based on mobile vs desktop
  const playerInfoHeight = isMobile ? Math.min(100, height * 0.12) : Math.min(140, height * 0.15)
  const actionMenuHeight = isMobile ? Math.min(120, height * 0.16) : Math.min(140, height * 0.15)
  const boardHeight = height - playerInfoHeight - actionMenuHeight

  return (
    <div
      className="w-full h-screen flex flex-col overflow-hidden relative"
      style={{ background: '#7CB3FF' }}
    >
      {/* Player Info - Responsive layout */}
      <div 
        className={`flex-shrink-0 flex overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-black/30 ${
          isMobile ? 'p-1 gap-2' : 'p-2 gap-4'
        }`}
        style={{ height: playerInfoHeight }}
      >
        {players.map((player, i) => (
          <PlayerInfo
            key={player.id}
            player={player}
            color={getUniqueColor(i)}
            width={isMobile ? Math.min(200, width / players.length - 8) : 280}
          />
        ))}
      </div>

      {/* Board - Takes remaining space */}
      <div 
        className="flex-1 min-h-0 p-1 flex justify-center items-center"
        style={{
          pointerEvents: gameEnded && !examiningBoard ? 'none' : 'auto',
          filter: gameEnded && !examiningBoard ? 'grayscale(0.2) brightness(0.9)' : 'none'
        }}
      >
        <Board
          width={width - 8}
          height={boardHeight - 8}
        />
      </div>

      {/* Action Menu - Fixed at bottom */}
      {!gameEnded && (
        <div 
          className="flex-shrink-0 border-t border-white/20"
          style={{ height: actionMenuHeight }}
        >
          <ActionMenu />
        </div>
      )}

      {gameEnded && !examiningBoard && (
        <EndGameScreen onExamineBoard={() => setExaminingBoard(true)} />
      )}
      {gameEnded && examiningBoard && (
        <div className="absolute top-2 right-2 z-60 flex gap-1">
          <button
            className="bg-white/90 border border-black/20 rounded-lg px-4 py-2 font-semibold cursor-pointer hover:bg-white"
            onClick={() => setExaminingBoard(false)}
          >
            Back to Results
          </button>
        </div>
      )}
    </div>
  )
}
