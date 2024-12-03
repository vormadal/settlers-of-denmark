import { Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, TextField } from '@mui/material'
import { Player } from '../../state/Player'
import { Room } from 'colyseus.js'
import { GameState } from '../../state/GameState'
import { useCallback, useState } from 'react'
import { useColyseus } from '../../context/ColyseusContext'
import { RoomNames } from '../../utils/RoomNames'

interface Props {
  setPlayer: (player?: Player) => void
  setRoom: (room: Room<GameState> | null) => void
  player?: Player
  room: Room<GameState> | null
}
export default function DebugMenu({ player, room, setPlayer, setRoom }: Props) {
  const [numPlayers, setNumPlayers] = useState(2)
  const [autoPlace, setAutoPlace] = useState(false)
  const [show, setShow] = useState(true)
  const client = useColyseus()

  const newGame = useCallback(async () => {
    const room = await client.createRoom(RoomNames.Debug, { numPlayers: numPlayers - 1, autoPlace })
    room?.send('startGame', { autoPlace })
    room?.state.listen('currentPlayer', (value) => {
      setPlayer(room.state.players.get(value))
    })
    setRoom(room)
  }, [setPlayer, client, autoPlace, setRoom, numPlayers])

  if (!show)
    return (
      <IconButton
        sx={{ position: 'absolute', zIndex: 10 }}
        onClick={() => setShow(true)}
      >
        Show
      </IconButton>
    )
  return (
    <Box sx={{ position: 'absolute', zIndex: 10, width: 300, background: '#fff' }}>
      <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column', padding: 1 }}>
        <Button onClick={() => setShow(false)}>Hide</Button>
        <TextField
          name="numPlayers"
          label="Number of Players"
          type="number"
          value={numPlayers}
          onChange={(e) => setNumPlayers(Number(e.target.value))}
        />
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={autoPlace}
                onChange={(e) => setAutoPlace(e.target.checked)}
              />
            }
            label="Auto place"
          />
          Auto placement
        </FormControl>
        <Button
          onClick={newGame}
          variant="contained"
          color="primary"
        >
          New Game
        </Button>
      </Box>
    </Box>
  )
}
