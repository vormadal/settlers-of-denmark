import { SkipNext as SkipNextIcon } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { usePlayer } from '../context/PlayerContext'
import { useRoom } from '../context/RoomContext'
import { useCurrentPlayer, useDice, usePhase } from '../hooks/stateHooks'
export default function ActionMenu() {
  const room = useRoom()
  const player = usePlayer()
  const currentPlayer = useCurrentPlayer()
  const dice = useDice()
  const phase = usePhase()

  return (
    <Box sx={{ padding: '0.5rem', display: 'flex', gap: 1 }}>
      <Fab
        color="primary"
        aria-label="end turn"
        disabled={player?.id !== currentPlayer?.id || phase.key !== 'turn'}
        onClick={() => room?.send('END_TURN')}
      >
        <SkipNextIcon />
      </Fab>

      {dice.map((x, i) => (
        <Box
          key={x.color}
          onClick={() => room?.send('ROLL_DICE')}
          sx={{
            width: 50,
            height: 50,
            borderRadius: '5px',
            textAlign: 'center',
            lineHeight: '50px',
            background: x.color,
            opacity: player?.id === currentPlayer?.id && phase.key === 'rollingDice' ? 1 : 0.5
          }}
        >
          {x.value}
        </Box>
      ))}

      {/* <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => room?.send('ROLL_DICE')}
          disabled={phase.key !== 'rollingDice' || me?.id !== currentPlayer?.id}
        >
          Roll Dice
        </Button> */}
    </Box>
  )
}
