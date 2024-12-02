import { CssBaseline, ThemeProvider } from '@mui/material'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { ColyseusProvider } from './context/ColyseusContext'
import DebugPage from './pages/DebugPage'
import GamePage from './pages/GamePage'
import LobbyPage from './pages/LobbyPage'
import theme from './theme'

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
      v7_skipActionErrorRevalidation: false
    }
  }
)

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <ColyseusProvider>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true
          }}
        />
      </ColyseusProvider>
    </ThemeProvider>
  )
}

export default App
