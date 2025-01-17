import { Room } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { BaseGame } from '../BaseGame'
import { useColyseus } from '../context/ColyseusContext'
import { PlayerContextProvider } from '../context/PlayerContext'
import { RoomContext } from '../context/RoomContext'
import { GameState } from '../state/GameState'

function GamePage() {
  const { roomId } = useParams()
  const [params] = useSearchParams()
  const client = useColyseus()
  const [gameRoom, setRoom] = useState<Room<GameState> | null>(client.room)

  useEffect(() => {
    if (!roomId) return
    client.joinRoom(roomId, params.get('name')).then((room) => {
      setRoom(room)
    })
  }, [client, roomId, params])

  if (!gameRoom) return null
  return (
    <RoomContext.Provider value={gameRoom}>
      <PlayerContextProvider>
        <BaseGame />
      </PlayerContextProvider>
    </RoomContext.Provider>
  )
}

export default GamePage
