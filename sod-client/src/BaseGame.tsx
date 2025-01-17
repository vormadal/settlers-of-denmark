import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { Board } from './Board'
import ActionMenu from './components/ActionMenu'
import { PlayerInfo } from './components/PlayerInfo'
import { usePlayers } from './hooks/stateHooks'
import { getUniqueColor } from './utils/colors'

export function BaseGame() {
  const players = usePlayers()
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })
  return (
    <Box
      width="100%"
      sx={{ background: '#7CB3FF' }}
    >
      <Box sx={{ padding: '1rem', position: 'absolute', gap: 1, display: 'flex' }}>
        {players.map((player, i) => (
          <PlayerInfo
            key={player.id}
            player={player}
            color={getUniqueColor(i)}
            width={300}
          />
        ))}
      </Box>
      <Box sx={{ width: '100%', height: height - 100, paddingLeft: '10px' }}>
        <Board
          width={width - 20}
          height={height - 100}
        />
      </Box>
      <Box sx={{ minHeight: '100px' }}>
        <ActionMenu />
      </Box>
    </Box>
  )
}
