import './App.css'

import { BaseGame } from './BaseGame'
import { useGameState } from './GameStateContext'
import { Lobby } from './Lobby'

function App() {
  const [, room] = useGameState()

  return (
    <div>
      {!room && <Lobby />}
      {room && <BaseGame />}
    </div>
  )
}

export default App
