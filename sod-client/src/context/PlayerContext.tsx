import { createContext, useContext, useEffect, useState } from 'react'
import { Player } from '../state/Player'
import { useRoom } from './RoomContext'
import { usePlayers } from '../hooks/stateHooks'

const PlayerContext = createContext<Player | undefined>(undefined)

export function usePlayer() {
  return useContext(PlayerContext)
}

interface Props {
  children: React.ReactElement
  override?: Player
}
export function PlayerContextProvider({ children, override }: Props) {
  const players = usePlayers()
  const room = useRoom()
  const [player, setPlayer] = useState<Player | undefined>(players.find((x) => x.id === room.sessionId))

  useEffect(() => {
    setPlayer(players.find((x) => x.id === room.sessionId))
  }, [players, room.sessionId])

  return <PlayerContext.Provider value={override || player}>{children}</PlayerContext.Provider>
}
