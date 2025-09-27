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

  // Calculate dynamic heights based on mobile vs desktop
  const playerInfoHeight = isMobile ? Math.min(100, height * 0.12) : Math.min(140, height * 0.15)
  const actionMenuHeight = isMobile ? Math.min(160, height * 0.22) : Math.min(180, height * 0.2) // Increased to accommodate development cards
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

      {/* Steal Resource Modal */}
      <StealResourceModal
        open={showStealModal}
        onClose={() => {}} // Modal should only close when a player is selected
        eligiblePlayers={eligiblePlayersForRobberActions}
      />

      {/* Monopoly Selection Modal */}
      <MonopolySelectionModal
        open={showMonopolyModal}
        onClose={() => {}} // Modal should only close when a resource is selected
      />

      {/* Year of Plenty Selection Modal */}
      <YearOfPlentyModal
        open={showYearOfPlentyModal}
        onClose={() => {}} // Modal should only close when resources are selected
      />

      {/* Discard Cards Modal */}
      <DiscardCardsModal
        open={showDiscardModal}
        onClose={() => {}} // Modal should only close when cards are discarded
        eligiblePlayers={eligiblePlayersForRobberActions}
      />
    </Box>
  )
}
