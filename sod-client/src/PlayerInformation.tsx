import { Box, Container } from '@mui/material'
import { useGameState } from './GameStateContext'
import { GameState } from './state/GameState'

interface Props {
  width: number
}

function getPhaseLabel(state: GameState) {
  switch (state.phase) {
    case 'placingHouse':
      return `${state.currentPlayer} is placing house`
    case 'placingRoad':
      return `${state.currentPlayer} is placing road`
    case 'rollingDice':
      return `${state.currentPlayer} is Rolling Dice`
    case 'turn':
      return `${state.currentPlayer}'s Turn`
    default:
      return state.phase
  }
}

export function PlayerInformation({ width }: Props) {
  const [state, room] = useGameState() 

  if (!state) return null

  const players = [...state.players.values()].sort((a, b) => (a.id === room?.sessionId ? -1 : 1))
  return (
    <Box
      component="section"
      sx={{ width: `${width}px` }}
    >
      <Container>
        <p>
          <strong>Room:</strong>
          {room?.roomId}
        </p>
        <p>{getPhaseLabel(state)}</p>
        {players.map((player, index) => (
          <Box
            key={player.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '1rem'
            }}
          >
            <p>
              <strong>
                {player.id}
                {index === 0 ? ' (ME)' : ''}
              </strong>
              <br />
              <strong>Houses:</strong> {player.houses.filter((x) => !x.intersection).length}
              <br />
              <strong>Roads:</strong> {player.roads.filter((x) => !x.edge).length}
            </p>
          </Box>
        ))}
      </Container>
    </Box>
  )
}
