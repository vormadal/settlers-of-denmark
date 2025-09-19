import { Box } from '@mui/material'
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
    <Box
      width="100%"
      height="100vh"
      sx={{ 
        background: '#7CB3FF',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Player Info - Responsive layout */}
      <Box 
        sx={{ 
          height: playerInfoHeight,
          padding: isMobile ? '0.25rem' : '0.5rem',
          display: 'flex',
          gap: isMobile ? 0.5 : 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          flexShrink: 0,
          '&::-webkit-scrollbar': {
            height: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 2,
          },
        }}
      >
        {players.map((player, i) => (
          <PlayerInfo
            key={player.id}
            player={player}
            color={getUniqueColor(i)}
            width={isMobile ? Math.min(200, width / players.length - 8) : 280}
          />
        ))}
      </Box>

      {/* Board - Takes remaining space */}
      <Box sx={{ 
        flex: 1,
        minHeight: 0,
        padding: '0.25rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
  pointerEvents: gameEnded && !examiningBoard ? 'none' : 'auto',
  filter: gameEnded && !examiningBoard ? 'grayscale(0.2) brightness(0.9)' : 'none'
      }}>
        <Board
          width={width - 8}
          height={boardHeight - 8}
        />
      </Box>

      {/* Action Menu - Fixed at bottom */}
      {!gameEnded && (
        <Box sx={{ 
          height: actionMenuHeight,
          flexShrink: 0,
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          <ActionMenu />
        </Box>
      )}

      {gameEnded && !examiningBoard && (
        <EndGameScreen onExamineBoard={() => setExaminingBoard(true)} />
      )}
      {gameEnded && examiningBoard && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 60, display: 'flex', gap: 1 }}>
          <button
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: 8,
              padding: '0.5rem 1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => setExaminingBoard(false)}
          >
            Back to Results
          </button>
        </Box>
      )}
    </Box>
  )
}
