import { Box, Button, Container, Typography } from '@mui/material'
import { PlayerCards } from './components/cards/PlayerCards'
import { usePlayer } from './context/PlayerContext'
import { useRoom } from './context/RoomContext'
import { useCurrentPlayer, useDice, usePhase, usePlayers } from './hooks/stateHooks'
import { getUniqueColor } from './utils/colors'
import { Link } from 'react-router-dom'

interface Props {
  width: number
}

export function PlayerInformation({ width }: Props) {
  const room = useRoom()
  const me = usePlayer()
  const players = usePlayers()
  const currentPlayer = useCurrentPlayer()
  const phase = usePhase()
  const dice = useDice()
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
          <Typography variant="body1">Player: {me?.id}</Typography>
          <Typography variant="body1">Current Player: {currentPlayer}</Typography>
          <Typography variant="body1">Room ID: {room?.roomId}</Typography>
          <Typography variant="body1">{phase.label}</Typography>
          <Typography variant="body1">Available intersections: {room.state.availableIntersections.length}</Typography>
          <Typography variant="body1">Available edges: {room.state.availableEdges.length}</Typography>
        </Box>
        {players.map((player, index) => (
          <Box
            key={player.id}
            sx={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: getUniqueColor(index, 160)
            }}
          >
            <Typography variant="h6">{player.id}</Typography>
            <Typography variant="body1">
              Settlements: {player.settlements.filter((x) => !x.intersection).length}
            </Typography>
            <Typography variant="body1">Cities: {player.cities.filter((x) => !x.intersection).length}</Typography>
            <Typography variant="body1">Roads: {player.roads.filter((x) => !x.edge).length}</Typography>

            <PlayerCards player={player} />
          </Box>
        ))}

        <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
          {dice.map((x, i) => (
            <Typography
              key={i}
              variant="body1"
            >
              {x.color}: {x.value}
            </Typography>
          ))}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => room?.send('ROLL_DICE')}
            disabled={phase.key !== 'rollingDice' || me?.id !== currentPlayer}
          >
            Roll Dice
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => room?.send('END_TURN')}
            disabled={phase.key !== 'turn' || me?.id !== currentPlayer}
          >
            End Turn
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/"
          >
            Exit
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
