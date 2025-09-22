import { Box, Button, Typography, Stack, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { usePlayers, useVictoryPointsToWin } from '../hooks/stateHooks'
import { useRoom } from '../context/RoomContext'

interface EndGameScreenProps {
  onExamineBoard?: () => void
}

export function EndGameScreen({ onExamineBoard }: EndGameScreenProps) {
  const players = usePlayers()
  const vpToWin = useVictoryPointsToWin()
  const navigate = useNavigate()
  const room = useRoom()

  // Calculate total victory points (public + secret) for each player
  const playersWithTotalVP = players.map(p => ({
    ...p,
    totalVP: (p.victoryPoints || 0) + (p.secretVictoryPoints || 0)
  }))
  
  const maxVP = Math.max(...playersWithTotalVP.map(p => p.totalVP), 0)
  const winners = playersWithTotalVP.filter(p => p.totalVP >= vpToWin && p.totalVP === maxVP)

  function returnToLobby() {
    try {
      room?.leave(true)
    } catch (e) {
      console.warn('Failed to leave room:', e)
    }
    navigate('/', { replace: true })
  }

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(6px)',
      background: 'rgba(10,10,30,0.55)',
      zIndex: 50,
      p: 2
    }}>
      <Paper elevation={6} sx={{
        maxWidth: 600,
        width: '100%',
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        textAlign: 'center',
        background: 'linear-gradient(145deg,#ffffff,#f1f3f8)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,107,53,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(78,205,196,0.18), transparent 65%)',
          pointerEvents: 'none'
        }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, position: 'relative' }}>
          🏆 Game Over
        </Typography>
        {winners.length > 0 ? (
          <>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, position: 'relative' }}>
              {winners.length === 1 ? 'Winner' : 'Winners'}
            </Typography>
            <Stack spacing={1} sx={{ mb: 3, position: 'relative' }}>
              {winners.map(w => (
                <Box key={w.id} sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, rgba(255,107,53,0.15), rgba(255,255,255,0.7))',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>
                  {w.name} — {w.totalVP} VP {w.secretVictoryPoints > 0 ? `(${w.victoryPoints}+${w.secretVictoryPoints}🔒)` : ''}
                </Box>
              ))}
            </Stack>
          </>
        ) : (
          <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
            No winner detected.
          </Typography>
        )}

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
          Final Scores
        </Typography>
        <Stack spacing={0.75} sx={{ mb: 4 }}>
          {playersWithTotalVP
            .sort((a, b) => b.totalVP - a.totalVP)
            .map(p => (
              <Box key={p.id} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: 1.5,
                px: 1.5,
                py: 0.75,
                fontWeight: winners.some(w => w.id === p.id) ? 700 : 400,
                boxShadow: winners.some(w => w.id === p.id) ? '0 0 0 2px #FF6B35' : 'none'
              }}>
                <span>{p.name}</span>
                <span>{p.totalVP} VP {p.secretVictoryPoints > 0 ? `(${p.victoryPoints}+${p.secretVictoryPoints}🔒)` : ''}</span>
              </Box>
            ))}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={returnToLobby}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(45deg,#4ECDC4,#45B7AA)',
              boxShadow: '0 6px 18px rgba(78,205,196,0.4)',
              '&:hover': { background: 'linear-gradient(45deg,#45B7AA,#3DA58A)' }
            }}
          >
            Return to Lobby
          </Button>
          {onExamineBoard && (
            <Button
              variant="outlined"
              size="large"
              onClick={onExamineBoard}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                backdropFilter: 'blur(2px)',
                background: 'rgba(255,255,255,0.4)',
                '&:hover': { background: 'rgba(255,255,255,0.6)' }
              }}
            >
              Examine Board
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}

export default EndGameScreen
