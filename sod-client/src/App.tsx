import { createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { ColyseusProvider } from './context/ColyseusContext'
import DebugPage from './pages/DebugPage'
import GamePage from './pages/GamePage'
import LobbyPage from './pages/LobbyPage'

const router = createHashRouter(
  [
    {
      path: '/',
      element: <LobbyPage />
    },
    {
      path: 'game/:roomId',

      element: <GamePage />
    },
    {
      path: 'debug',
      element: <DebugPage />
    }
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
      v7_partialHydration: true,
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
      v7_relativeSplatPath: true,
    }
  }
)

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <ColyseusProvider>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true
          }}
        />
      </ColyseusProvider>
    </div>
  )
}

export default App
