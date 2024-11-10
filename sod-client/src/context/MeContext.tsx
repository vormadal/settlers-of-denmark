import { createContext, useContext, useEffect, useState } from 'react'
import { useGameState } from './GameStateContext'
import { Player } from '../state/Player'

const MeContext = createContext<[Player | undefined, (id: string) => void]>([undefined, () => {}])

export function useMyPlayer() {
  return useContext(MeContext)
}

export function MeContextProvider({ children }: { children: React.ReactElement }) {
  const [override, setOverride] = useState<string | undefined>(undefined)
  const [state, room] = useGameState()
  const [me, setMe] = useState<Player>()
  useEffect(() => {
    setMe(state?.players.get(override || room?.sessionId || ''))
  }, [state, room, override])

  return <MeContext.Provider value={[me, setOverride]}>{children}</MeContext.Provider>
}
