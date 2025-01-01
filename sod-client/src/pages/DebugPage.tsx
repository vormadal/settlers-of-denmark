import { Box } from '@mui/material'
import { Room } from 'colyseus.js'
import { useState } from 'react'
import { BaseGame } from '../BaseGame'
import DebugMenu from '../components/debug/DebugMenu'
import { useColyseus } from '../context/ColyseusContext'
import { PlayerContextProvider } from '../context/PlayerContext'
import { RoomContext } from '../context/RoomContext'
import { GameState } from '../state/GameState'
import { Player } from '../state/Player'

function DebugPage() {
  const client = useColyseus()
  const [gameRoom, setRoom] = useState<Room<GameState> | null>(client.room)
  const [player, setPlayer] = useState<Player | undefined>(undefined)

  return (
    <Box sx={{ width: '100%', background: '#7CB3FF', display: 'flex' }}>
      <DebugMenu
        player={player}
        room={gameRoom}
        setPlayer={setPlayer}
        setRoom={setRoom}
      />
      {gameRoom && (
        <RoomContext.Provider value={gameRoom}>
          <PlayerContextProvider override={player}>
            <BaseGame />
          </PlayerContextProvider>
        </RoomContext.Provider>
      )}
    </Box>
  )
}

export default DebugPage
