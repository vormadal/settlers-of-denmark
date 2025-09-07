import {
  Add as AddIcon,
  Groups as GroupsIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  Grid2 as Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Zoom
} from '@mui/material'
import { RoomAvailable } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CityIcon } from './components/icons/CityIcon'
import { RoadIcon } from './components/icons/RoadIcon'
import { SettlementIcon } from './components/icons/SettlementIcon'
import { useColyseus } from './context/ColyseusContext'
import { GameState } from './state/GameState'
import { RoomNames } from './utils/RoomNames'

export function Lobby() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const client = useColyseus()
  const [rooms, setRooms] = useState<RoomAvailable<GameState>[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load name from session storage on component mount
  useEffect(() => {
    const storedName = sessionStorage.getItem('player-name')
    if (storedName) {
      setName(storedName)
    }
  }, [])

  // Save name to session storage whenever it changes
  useEffect(() => {
    if (name) {
      sessionStorage.setItem('player-name', name)
    }
  }, [name])

  useEffect(() => {
    refreshRooms()
  }, [client])

  async function refreshRooms() {
    setIsRefreshing(true)
    try {
      const rooms = await client.getRooms()
      setRooms(rooms)
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  async function createRoom() {
    if (!name.trim()) return
    try {
      const room = await client.createRoom(RoomNames.OneVsOne, { name: name.trim() })
      if (!room) return
      joinRoom(room.id)
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  async function joinRoom(id: string) {
    if (!name.trim()) return
    navigate(`/game/${id}?name=${name.trim()}`, {
      viewTransition: true
    })
  }

  const isNameValid = name.trim().length > 0

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)
          `,
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                color: 'white',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              🏰 Settlers of Denmark
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontWeight: 400
              }}
            >
              Build, trade, and conquer the Danish lands!
            </Typography>
            
            {/* Decorative icons */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 2 }}>
              <Box sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                <SettlementIcon size={32} color="#FFE066" />
              </Box>
              <Box sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                <CityIcon size={32} color="#FF6B6B" />
              </Box>
              <Box sx={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                <RoadIcon size={32} color="#4ECDC4" />
              </Box>
            </Stack>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Player Setup Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Zoom in timeout={600}>
              <Card 
                sx={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      textAlign: 'center',
                      color: '#333',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                    }}
                  >
                    👤 Enter Your Name
                  </Typography>
                  
                  <TextField
                    name="name"
                    label="Player Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                        }
                      }
                    }}
                    placeholder="Enter your Viking name..."
                  />

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={createRoom}
                    disabled={!isNameValid}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E53 100%)',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5252 0%, #FF7043 100%)',
                        boxShadow: '0 6px 16px rgba(255, 107, 107, 0.6)',
                        transform: 'translateY(-1px)'
                      },
                      '&:disabled': {
                        background: 'rgba(0,0,0,0.1)',
                        color: 'rgba(0,0,0,0.4)'
                      }
                    }}
                  >
                    🎮 Create New Game
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Available Games Card */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Zoom in timeout={800}>
              <Card 
                sx={{
                  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  minHeight: '400px'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#333',
                        textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      🏛️ Available Games
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={refreshRooms}
                      disabled={isRefreshing}
                      startIcon={<RefreshIcon />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        borderColor: '#4ECDC4',
                        color: '#4ECDC4',
                        '&:hover': {
                          borderColor: '#45B7AA',
                          color: '#45B7AA',
                          background: 'rgba(78, 205, 196, 0.05)'
                        }
                      }}
                    >
                      Refresh
                    </Button>
                  </Box>

                  {!rooms.length && !isRefreshing && (
                    <Paper 
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'rgba(0,0,0,0.6)',
                          mb: 1,
                          fontWeight: 600
                        }}
                      >
                        🌅 No games available
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: 'rgba(0,0,0,0.5)' }}
                      >
                        Be the first to start a new settlement!
                      </Typography>
                    </Paper>
                  )}

                  {isRefreshing && (
                    <Paper 
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                        🔄 Loading games...
                      </Typography>
                    </Paper>
                  )}

                  <Stack spacing={2}>
                    {rooms.map((room, index) => (
                      <Fade in timeout={300 + index * 100} key={room.roomId}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            borderRadius: '12px',
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            transition: 'all 0.2s ease-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                              borderColor: '#4ECDC4'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 700,
                                  color: '#333',
                                  mb: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)' }}>
                                  🏰
                                </Avatar>
                                {room.name || 'Unnamed Game'}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Chip 
                                  icon={<GroupsIcon />}
                                  label={`${room.clients} / ${room.maxClients} players`}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(45deg, #4ECDC4, #45B7AA)',
                                    color: 'white',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': { color: 'white' }
                                  }}
                                />
                                <Chip 
                                  label={room.roomId.substring(0, 8)}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    borderColor: 'rgba(0,0,0,0.2)',
                                    color: 'rgba(0,0,0,0.6)',
                                    fontFamily: 'monospace'
                                  }}
                                />
                              </Stack>
                            </Box>
                            
                            <Button
                              variant="contained"
                              onClick={() => joinRoom(room.roomId)}
                              disabled={!isNameValid || room.clients >= room.maxClients}
                              startIcon={<PlayArrowIcon />}
                              sx={{
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #4ECDC4 0%, #45B7AA 100%)',
                                boxShadow: '0 3px 8px rgba(78, 205, 196, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #45B7AA 0%, #3DA58A 100%)',
                                  boxShadow: '0 4px 12px rgba(78, 205, 196, 0.4)',
                                  transform: 'translateY(-1px)'
                                },
                                '&:disabled': {
                                  background: 'rgba(0,0,0,0.1)',
                                  color: 'rgba(0,0,0,0.4)'
                                }
                              }}
                            >
                              {room.clients >= room.maxClients ? 'Full' : 'Join Game'}
                            </Button>
                          </Box>
                        </Paper>
                      </Fade>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
