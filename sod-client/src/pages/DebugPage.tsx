import { Box, Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'
import { Board } from '../Board'
import { useColyseus } from '../context/ColyseusContext'
import { useCallback, useEffect, useState } from 'react'
import { useGameState } from '../context/GameStateContext'
import { GameState } from '../state/GameState'
import { PlayerInformation } from '../PlayerInformation'
import { useMyPlayer } from '../context/MeContext'

const sidebarWidth = 300
function DebugPage() {
  const [numPlayers, setNumPlayers] = useState(2)
  const [autoPlace, setAutoPlace] = useState(false)
  const client = useColyseus()
  const [state, room, setRoom] = useGameState()
  const [, setMe] = useMyPlayer()

  const newGame = useCallback(async () => {
    const room = await client.create<GameState>('debug', { numPlayers, autoPlace })
    setRoom(room)
    room?.send('startGame', { autoPlace })
  }, [client, autoPlace, setRoom, numPlayers])

  useEffect(() => {
    if (!state) return
    setMe(state.currentPlayer)
  }, [state, setMe])

  return (
    <Box sx={{ width: '100%', background: '#7CB3FF', display: 'flex' }}>
      <Box sx={{ width: sidebarWidth, background: '#fff' }}>
        <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column', padding: 1 }}>
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
        <PlayerInformation width={sidebarWidth} />
      </Box>
      <Board width={window.innerWidth - sidebarWidth} />
    </Box>
  )
}

export default DebugPage
