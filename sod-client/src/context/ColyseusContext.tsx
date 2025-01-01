import { createContext, useContext } from 'react'
import { ColyseusClient } from '../ColyseusClient'

export const ColyseusContext = createContext<ColyseusClient>(ColyseusClient.instance)

interface Props {
  children: React.ReactNode
}

export const ColyseusProvider = ({ children }: Props) => {
  return <ColyseusContext.Provider value={ColyseusClient.instance}>{children}</ColyseusContext.Provider>
}

export function useColyseus() {
  return useContext(ColyseusContext)
}
