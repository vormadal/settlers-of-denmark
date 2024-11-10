import { Box, Button } from '@mui/material'
import { Board } from '../Board'
import { useColyseus } from '../context/ColyseusContext'
import { useCallback, useEffect } from 'react'
import { useGameState } from '../context/GameStateContext'
import { GameState } from '../state/GameState'
import { PlayerInformation } from '../PlayerInformation'
import { useMyPlayer } from '../context/MeContext'

const sidebarWidth = 300
function DebugPage() {
  const client = useColyseus()
  const [state, room, setRoom] = useGameState()
  const [me, setMe] = useMyPlayer()

  const newGame = useCallback(async () => {
    const room = await client.create<GameState>('debug')
    setRoom(room)
  }, [client, setRoom])

  const addPlayer = useCallback(async () => {
    room?.send('addPlayer')
  }, [room])

  const startGame = useCallback(async () => {
    room?.send('startGame')
  }, [room])

  const changeTurn = useCallback(
    async (id: string) => {
      setMe(id)
    },
    [setMe]
  )

  useEffect(() => {
    newGame()
  }, [newGame])

  return (
    <Box sx={{ width: '100%', background: '#7CB3FF', display: 'flex' }}>
      <Box sx={{ width: sidebarWidth, background: '#fff' }}>
        <Button
          onClick={newGame}
          variant="contained"
          color="primary"
        >
          New Game
        </Button>

        <Button
          onClick={addPlayer}
          variant="contained"
          color="primary"
        >
          Add Player
        </Button>

        <Button
          onClick={startGame}
          variant="contained"
          color="primary"
        >
          Start Game
        </Button>
        {[...(state?.players.values() || [])].map((x) => (
          <Button
            key={x.id}
            onClick={() => changeTurn(x.id)}
          >
            Change Turn ({x.id})
          </Button>
        ))}
        <p>
            Me: {me?.id}
        </p>
        <PlayerInformation width={sidebarWidth} />
      </Box>
      <Board width={window.innerWidth - sidebarWidth} />
    </Box>
  )
}

export default DebugPage
