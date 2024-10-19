import { createContext, useContext, useState } from "react";
import { GameState } from "./state/GameState";

type ContextValueType = [
  state: GameState | undefined,
  updateState: (state?: GameState) => void
];
const GameStateContext = createContext<ContextValueType>([undefined, () => {}]);

interface Props {
  children: React.ReactElement;
}
export function GameStateContextProvider({ children }: Props) {
  const [state, setState] = useState<GameState>();
  return (
    <GameStateContext.Provider value={[state, setState]}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}
