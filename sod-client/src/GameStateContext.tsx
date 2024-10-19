import { createContext, useContext, useState } from "react";
import { MyRoomState } from "./state/MyRoomState";

type ContextValueType = [
  state: MyRoomState | undefined,
  updateState: (state?: MyRoomState) => void
];
const GameState = createContext<ContextValueType>([undefined, () => {}]);

interface Props {
  children: React.ReactElement;
}
export function GameStateContextProvider({ children }: Props) {
  const [state, setState] = useState<MyRoomState>();
  return (
    <GameState.Provider value={[state, setState]}>
      {children}
    </GameState.Provider>
  );
}

export function useGameState() {
  return useContext(GameState);
}
