import { createContext, useContext } from "react";
import * as Colyseus from "colyseus.js";

const client = new Colyseus.Client("ws://localhost:2567");
const ColyseusContext = createContext(client);

interface Props {
  children: React.ReactElement;
}
export function ColyseusContextProvider({ children }: Props) {
  return (
    <ColyseusContext.Provider value={client}>
      {children}
    </ColyseusContext.Provider>
  );
}

export function useColyseus() {
  return useContext(ColyseusContext);
}
