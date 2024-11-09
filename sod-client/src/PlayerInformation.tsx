import { Box, Container, Typography } from '@mui/material'
import { PlayerCards } from './components/cards/PlayerCards'
import { useGameState } from './GameStateContext'
import { GameState } from './state/GameState'

interface Props {
  width: number
}

function getPhaseLabel(state: GameState) {
  switch (state.phase) {
    case 'placingSettlement':
      return `${state.currentPlayer} is placing settlement`
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
      sx={{ width: `${width}px`, background: 'rgba(255, 255, 255, 0.5)', borderRadius: '0 1rem 1rem 0' }}
    >
      <Container>
        <Box
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            marginBottom: '1rem'
          }}
        >
          <Typography variant="h6">Settlers of Denmark</Typography>
          <Typography variant="body1">{room?.roomId}</Typography>
          <Typography variant="body1">{getPhaseLabel(state)}</Typography>
        </Box>
        {players.map((player, index) => (
          <Box
            key={player.id}
            sx={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography variant="h6">{player.id}</Typography>
            <Typography variant="body1">
              Settlements: {player.settlements.filter((x) => !x.intersection).length}
            </Typography>
            <Typography variant="body1">
              Cities: {player.cities.filter((x) => !x.intersection).length}
            </Typography>
            <Typography variant="body1">Roads: {player.roads.filter((x) => !x.edge).length}</Typography>

            <PlayerCards player={player} />
          </Box>
        ))}
      </Container>
    </Box>
  )
}
