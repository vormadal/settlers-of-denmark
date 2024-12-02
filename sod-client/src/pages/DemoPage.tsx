import { Box, Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'
import { Room } from 'colyseus.js'
import { useCallback, useState } from 'react'
import { Board } from '../Board'
import { PlayerInformation } from '../PlayerInformation'
import { PlayerContextProvider } from '../context/PlayerContext'
import { RoomContext } from '../context/RoomContext'
import { GameState } from '../state/GameState'
import { Player } from '../state/Player'
import { RoomNames } from '../utils/RoomNames'
import { useColyseus } from '../context/ColyseusContext'

const sidebarWidth = 300
function DebugPage() {
  const [numPlayers, setNumPlayers] = useState(2)
  const [autoPlace, setAutoPlace] = useState(false)
  const client = useColyseus()
  const [gameRoom, setRoom] = useState<Room<GameState> | null>(client.room)
  const [player, setPlayer] = useState<Player | undefined>(undefined)

  const newGame = useCallback(async () => {
    const room = await client.createRoom(RoomNames.Debug, { numPlayers: numPlayers - 1, autoPlace })
    room?.send('startGame', { autoPlace })
    room?.state.listen('currentPlayer', (value) => {
      setPlayer(room.state.players.get(value))
    })
    setRoom(room)
  }, [client, autoPlace, setRoom, numPlayers])

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
        {gameRoom && (
          <RoomContext.Provider value={gameRoom}>
            <PlayerContextProvider override={player}>
              <PlayerInformation width={sidebarWidth} />
            </PlayerContextProvider>
          </RoomContext.Provider>
        )}
      </Box>
      {gameRoom && (
        <RoomContext.Provider value={gameRoom}>
          <PlayerContextProvider override={player}>
            <Board width={window.innerWidth - sidebarWidth} />
          </PlayerContextProvider>
        </RoomContext.Provider>
      )}
    </Box>
  )
}

export default DebugPage
