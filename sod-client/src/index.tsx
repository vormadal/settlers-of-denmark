import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import { ColyseusContextProvider } from './context/ColyseusContext'
import { GameStateContextProvider } from './context/GameStateContext'
import './index.css'
import DebugPage from './pages/DebugPage'
import LobbyPage from './pages/LobbyPage'
import reportWebVitals from './reportWebVitals'
import theme from './theme'
import { MeContextProvider } from './context/MeContext'

const router = createHashRouter(
  [
    {
      path: '/',
      element: <LobbyPage />
    },
    {
      path: 'game',
      element: <App />
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
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <ColyseusContextProvider>
        <GameStateContextProvider>
          <MeContextProvider>
            <RouterProvider
              router={router}
              future={{
                v7_startTransition: true
              }}
            />
          </MeContextProvider>
        </GameStateContextProvider>
      </ColyseusContextProvider>
    </ThemeProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
