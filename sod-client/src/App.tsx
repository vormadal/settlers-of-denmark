import './App.css'

import { BaseGame } from './BaseGame'
import { useGameState } from './context/GameStateContext'

function App() {
  const [, room] = useGameState()

  return (
    <div>
      {room && <BaseGame />}
    </div>
  )
}

export default App
