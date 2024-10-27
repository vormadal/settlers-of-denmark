import { Box } from '@mui/material'
import { Board } from './Board'
import { PlayerInformation } from './PlayerInformation'


export function BaseGame() {
  return (
    <Box
      width="100%"
      sx={{ background: '#7CB3FF', display: 'flex' }}
    >
      <PlayerInformation width={300} />
      <Board width={window.innerWidth - 300} />
    </Box>
  )
}
