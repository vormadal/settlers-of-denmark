import "./App.css";

import { BaseGame } from "./BaseGame";
import { useGameState } from "./GameStateContext";
import { Lobby } from "./Lobby";

function App() {
  const [state] = useGameState();

  return (
    <div>
      {!state && <Lobby />}

      {state && <BaseGame state={state} />}
    </div>
  );
}

export default App;
