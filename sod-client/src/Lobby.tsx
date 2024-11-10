import { Box, Button, Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Room, RoomAvailable } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { useColyseus } from './context/ColyseusContext'
import { useGameState } from './context/GameStateContext'
import { GameState } from './state/GameState'
import { useNavigate } from 'react-router-dom'

export function Lobby() {
  const navigate = useNavigate()
  const client = useColyseus()
  const [, , setRoom] = useGameState()
  const [rooms, setRooms] = useState<RoomAvailable<GameState>[]>([])
  const [reconnectionToken, setReconnectionToken] = useState(sessionStorage.getItem('reconnectionToken'))

  useEffect(() => {
    client.getAvailableRooms<GameState>().then((rooms) => {
      setRooms(rooms)
    })
  }, [setRooms, client])

  function attachStateListener(room: Room<GameState>) {
    sessionStorage.setItem('reconnectionToken', room.reconnectionToken)
    setReconnectionToken(room.reconnectionToken)
    setRoom(room)
    navigate('/game')
  }

  async function createRoom() {
    const room = await client.create<GameState>('my_room')
    attachStateListener(room)
  }

  async function joinRoom(id: string) {
    const room = await client.joinById<GameState>(id)
    attachStateListener(room)
  }

  async function handleReconnect() {
    if (!reconnectionToken) return
    const room = await client.reconnect<GameState>(reconnectionToken)
    attachStateListener(room)
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2 }}
        >
          Lobby
        </Typography>
        {reconnectionToken && <Button onClick={handleReconnect}>Reconnect</Button>}
        <List>
          {!rooms.length && <Typography variant="body1">No available rooms</Typography>}
          {rooms.map((x) => (
            <ListItem
              key={x.roomId}
              secondaryAction={
                <Button
                  aria-label="join"
                  onClick={() => joinRoom(x.roomId)}
                >
                  Join
                </Button>
              }
            >
              <ListItemText
                primary={x.name}
                secondary={x.roomId}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          onClick={createRoom}
        >
          Create room
        </Button>
      </Box>
    </Container>
  )
}
