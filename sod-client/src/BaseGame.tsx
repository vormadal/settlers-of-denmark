import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { Board } from './Board'
import ActionMenu from './components/ActionMenu'
import { EndGameScreen } from './components/EndGameScreen'
import { PlayerInfo } from './components/PlayerInfo'
import { WaitingSplashScreen } from './components/WaitingSplashScreen'
import { StealResourceModal } from './components/StealResourceModal'
import { MonopolySelectionModal } from './components/MonopolySelectionModal'
import { YearOfPlentyModal } from './components/YearOfPlentyModal'
import { DiscardCardsModal } from './components/DiscardCardsModal'
import { useIsGameEnded, usePlayers, usePhase, useAvailablePlayersToSomethingFrom, useCurrentPlayer } from './hooks/stateHooks'
import { usePlayer } from './context/PlayerContext'
import { getUniqueColor } from './utils/colors'

function getBackgroundLinearGradient(deg: number): string {
  return `linear-gradient(${deg}deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)`
}
export function BaseGame() {
  const players = usePlayers()
  const currentPlayer = useCurrentPlayer() // The player whose turn it is
  const player = usePlayer() // The current user's player
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const isMobile = width < 768
  const gameEnded = useIsGameEnded()
  const [examiningBoard, setExaminingBoard] = useState(false)
  const phase = usePhase()
  const eligiblePlayersForRobberActions = useAvailablePlayersToSomethingFrom()

  // Only show modals if the current user is the player whose turn it is
  const isCurrentPlayerTurn = Boolean(player && currentPlayer && player.id === currentPlayer.id)

  const showStealModal = Boolean(phase.key === 'stealingResource' && isCurrentPlayerTurn)
  const showMonopolyModal = Boolean(phase.key === 'playingMonopoly' && isCurrentPlayerTurn)
  const showYearOfPlentyModal = Boolean(phase.key === 'playingYearOfPlenty' && isCurrentPlayerTurn)
  const showDiscardModal = Boolean(
    phase.key === 'discardingResources' &&
    eligiblePlayersForRobberActions.some(p => p.id === player?.id)
  )

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

  // Calculate dynamic heights for overlay elements
  const playerInfoHeight = isMobile ? Math.min(100, height * 0.12) : Math.min(140, height * 0.15)
  const actionMenuHeight = isMobile ? Math.min(160, height * 0.22) : Math.min(180, height * 0.2) // Increased to accommodate development cards

  return (
    <Box
      width="100%"
      height="100vh"
      sx={{
        background: '#7CB3FF',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Board - Full screen background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: gameEnded && !examiningBoard ? 'none' : 'auto',
        filter: gameEnded && !examiningBoard ? 'grayscale(0.2) brightness(0.9)' : 'none'
      }}>
        <Board
          width={width}
          height={height}
        />
      </Box>

      {/* Player Info - Mobile: top overlay, Desktop: left side overlay */}
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          ...(isMobile ? {
            // Mobile: top overlay
            right: 0,
            height: playerInfoHeight,
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'hidden',
            background: getBackgroundLinearGradient(180),
            gap: 0.5,
            padding: '0.25rem',
            '&::-webkit-scrollbar': {
              width: 'auto',
              height: 4,
            },
          } : {
            // Desktop: left side overlay
            bottom: 0,
            width: '320px',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
            background: getBackgroundLinearGradient(90),
            gap: 0.5,
            padding: '0.5rem',
            '&::-webkit-scrollbar': {
              width: 4,
              height: 'auto',
            },
          }),
          backdropFilter: 'blur(2px)',
          zIndex: 10,

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
            width={isMobile ? Math.min(200, width / players.length - 8) : 300}
          />
        ))}
      </Box>

      {/* Action Menu - Mobile: bottom overlay, Desktop: right side overlay */}
      {!gameEnded && (
        <Box sx={{
          position: 'absolute',
          ...(isMobile ? {
            // Mobile: bottom overlay
            bottom: 0,
            left: 0,
            right: 0,
            height: actionMenuHeight,
            background: getBackgroundLinearGradient(0),
          } : {
            // Desktop: right side overlay
            top: 0,
            right: 0,
            bottom: 0,
            width: '400px',
            background: getBackgroundLinearGradient(270),
          }),
          backdropFilter: 'blur(2px)',
          zIndex: 10
        }}>
          <ActionMenu />
        </Box>
      )}

      {gameEnded && !examiningBoard && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 20
        }}>
          <EndGameScreen onExamineBoard={() => setExaminingBoard(true)} />
        </Box>
      )}
      {gameEnded && examiningBoard && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 30, display: 'flex', gap: 1 }}>
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

      {/* Steal Resource Modal */}
      <Box sx={{ zIndex: 40 }}>
        <StealResourceModal
          open={showStealModal}
          onClose={() => { }} // Modal should only close when a player is selected
          eligiblePlayers={eligiblePlayersForRobberActions}
        />
      </Box>

      {/* Monopoly Selection Modal */}
      <Box sx={{ zIndex: 40 }}>
        <MonopolySelectionModal
          open={showMonopolyModal}
          onClose={() => { }} // Modal should only close when a resource is selected
        />
      </Box>

      {/* Year of Plenty Selection Modal */}
      <Box sx={{ zIndex: 40 }}>
        <YearOfPlentyModal
          open={showYearOfPlentyModal}
          onClose={() => { }} // Modal should only close when resources are selected
        />
      </Box>

      {/* Discard Cards Modal */}
      <Box sx={{ zIndex: 40 }}>
        <DiscardCardsModal
          open={showDiscardModal}
          onClose={() => { }} // Modal should only close when cards are discarded
          eligiblePlayers={eligiblePlayersForRobberActions}
        />
      </Box>
    </Box>
  )
}
