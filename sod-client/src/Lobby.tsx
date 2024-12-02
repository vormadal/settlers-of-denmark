import { Box, Button, Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import { RoomAvailable } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameState } from './state/GameState'
import { RoomNames } from './utils/RoomNames'
import { useColyseus } from './context/ColyseusContext'

export function Lobby() {
  const navigate = useNavigate()
  const client = useColyseus()
  const [rooms, setRooms] = useState<RoomAvailable<GameState>[]>([])

  useEffect(() => {
    client.getRooms().then((rooms) => {
      setRooms(rooms)
    })
  }, [client, setRooms])

  async function createRoom() {
    const room = await client.createRoom(RoomNames.OneVsOne)
    if (!room) return
    joinRoom(room.id)
  }

  async function joinRoom(id: string) {
    navigate(`/game/${id}`, {
      viewTransition: true
    })
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
