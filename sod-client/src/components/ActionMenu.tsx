import { FastForward as FastForwardIcon } from '@mui/icons-material'
import { Box, useMediaQuery, useTheme, IconButton } from '@mui/material'
import { usePlayer } from '../context/PlayerContext'
import { useRoom } from '../context/RoomContext'
import { useCurrentPlayer, useDice, usePhase } from '../hooks/stateHooks'
import { PlayerCards } from './cards/PlayerCards'
import DiceComponent from './DiceComponent'

export default function ActionMenu() {
  const room = useRoom()
  const player = usePlayer()
  const currentPlayer = useCurrentPlayer()
  const dice = useDice()
  const phase = usePhase()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ 
      padding: isMobile ? '0.5rem 0.25rem' : '0.75rem 0.5rem', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? 0.75 : 1, 
      minWidth: 0,
      height: '100%'
    }}>
      {/* Dice row - at the top */}
      <Box sx={{ 
        display: 'flex', 
        gap: 0.5, 
        justifyContent: 'right', 
        alignItems: 'center',
        minHeight: 0
      }}>
        {dice.map((x, i) => (
          <DiceComponent
            key={x.color}
            value={x.value}
            color={x.color}
            disabled={player?.id !== currentPlayer?.id || phase.key !== 'rollingDice'}
            onClick={() => room?.send('ROLL_DICE')}
            size={isMobile ? 'small' : 'medium'}
          />
        ))}
      </Box>

      {/* Cards and button row - at the bottom */}
      <Box sx={{ 
        display: 'flex', 
        gap: isMobile ? 0.75 : 1, 
        alignItems: 'center', 
        minWidth: 0,
        flex: 1,
        minHeight: 0
      }}>
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
          {player && <PlayerCards player={player} />}
        </Box>
        <IconButton
          disabled={player?.id !== currentPlayer?.id || phase.key !== 'turn'}
          onClick={() => room?.send('END_TURN')}
          sx={{ 
            flexShrink: 0,
            width: isMobile ? 44 : 52,
            height: isMobile ? 44 : 52,
            backgroundColor: '#FF6B35',
            borderRadius: '50%',
            border: '3px solid #FFF',
            boxShadow: '0 4px 8px rgba(255, 107, 53, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
            transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            position: 'relative',
            '&:hover:not(:disabled)': {
              backgroundColor: '#FF8A65',
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 6px 12px rgba(255, 107, 53, 0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
            },
            '&:active:not(:disabled)': {
              transform: 'scale(0.95)',
              transition: 'all 0.1s ease',
            },
            '&:disabled': {
              backgroundColor: '#CCCCCC',
              opacity: 0.6,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '15%',
              left: '20%',
              width: '25%',
              height: '25%',
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: '50%',
              filter: 'blur(1px)',
            },
          }}
        >
          <FastForwardIcon 
            sx={{ 
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              color: 'white',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            }} 
          />
        </IconButton>
      </Box>
    </Box>
  )
}
