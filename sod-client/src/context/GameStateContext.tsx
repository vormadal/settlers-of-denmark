import { createContext, useContext, useEffect, useState } from 'react'
import { GameState } from '../state/GameState'
import { Room } from 'colyseus.js'

type ContextValueType = [
  state: GameState | undefined,
  room: Room<GameState> | undefined,
  updateState: (room?: Room<GameState>) => void
]
const GameStateContext = createContext<ContextValueType>([undefined, undefined, () => {}])

interface Props {
  children: React.ReactElement
}
export function GameStateContextProvider({ children }: Props) {
  const [state, setState] = useState<GameState>()
  const [room, setRoom] = useState<Room<GameState>>()

  useEffect(() => {
    if (!room) return
    room.onStateChange((newState) => {
      setState({...newState} as any) //HACK: this is to force a re-render
    })
  }, [room])

  return <GameStateContext.Provider value={[state, room, setRoom]}>{children}</GameStateContext.Provider>
}

export function useGameState() {
  return useContext(GameStateContext)
}
