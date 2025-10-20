import { createContext, useContext } from 'react'
import { ColyseusClient } from '../ColyseusClient'

const client = new ColyseusClient()
export const ColyseusContext = createContext<ColyseusClient>(client)

interface Props {
  children: React.ReactNode
}

export const ColyseusProvider = ({ children }: Props) => {
  return <ColyseusContext.Provider value={client}>{children}</ColyseusContext.Provider>
}

export function useColyseus() {
  return useContext(ColyseusContext)
}
