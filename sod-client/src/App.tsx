import "./App.css";

import { BaseGame } from "./BaseGame";
import { useGameState } from "./GameStateContext";
import { Lobby } from "./Lobby";

function App() {
  const [_, room] = useGameState();

  return (
    <div>
      {!room && <Lobby />}

      {room && <BaseGame room={room} />}
    </div>
  );
}

export default App;
