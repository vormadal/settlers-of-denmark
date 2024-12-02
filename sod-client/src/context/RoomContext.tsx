import { Room } from 'colyseus.js'
import { createContext, useContext } from 'react'
import { GameState } from '../state/GameState'

export const RoomContext = createContext<Room<GameState>>(undefined as any)

export function useRoom() {
  return useContext(RoomContext)
}
