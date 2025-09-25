import React from 'react'
import { 
  Box, 
  Typography,
  Button,
  Grid2
} from '@mui/material'
import { useRoom } from '../context/RoomContext'
import { usePlayer } from '../context/PlayerContext'
import { CardVariants } from '../utils/CardVariants'
import { colors } from '../utils/colors'
import { BaseCard } from './cards/BaseCard'
import { GameModal } from './GameModal'

interface Props {
  open: boolean
  onClose: () => void
}

const resourceVariants = [
  CardVariants.Lumber,
  CardVariants.Wool,
  CardVariants.Grain,
  CardVariants.Ore,
  CardVariants.Brick,
]

const resourceEmojis = {
  [CardVariants.Lumber]: '🌲',
  [CardVariants.Wool]: '🐑',
  [CardVariants.Grain]: '🌾',
  [CardVariants.Ore]: '🏔️',
  [CardVariants.Brick]: '🧱',
}

export function MonopolySelectionModal({ open, onClose }: Props) {
  const room = useRoom()
  const player = usePlayer()

  const handleSelectResource = (resourceType: string) => {
    if (player) {
      room?.send('SELECT_MONOPOLY_RESOURCE', { 
        playerId: player.id,
        resourceVariant: resourceType
      })
    }
    onClose()
  }

  return (
    <GameModal
      open={open}
      onClose={onClose}
      title="🏛️ Monopoly Card"
      accentColor="#dc143c"
      maxWidth="xs"
      fullWidth={false}
      paperSx={{ maxWidth: '500px', width: 'auto' }}
      contentSx={{ padding: 3, overflow: 'hidden' }}
      minimizable={{ showLabel: '🏛️ Show Monopoly' }}
    >
        <Typography variant="body1" sx={{ marginBottom: 3, textAlign: 'center' }}>
          Choose which resource type you want to monopolize:
        </Typography>
        
        <Grid2 container spacing={1} justifyContent="center" sx={{ maxWidth: '100%', overflow: 'hidden', padding: 1 }}>
          {resourceVariants.map((resourceType) => (
            <Grid2 key={resourceType}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleSelectResource(resourceType)}
                  sx={{
                    padding: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    backgroundColor: 'rgba(220, 20, 60, 0.05)',
                    border: '2px solid rgba(220, 20, 60, 0.3)',
                    borderRadius: 2,
                    minHeight: 100,
                    minWidth: 80,
                    '&:hover': {
                      backgroundColor: 'rgba(220, 20, 60, 0.1)',
                      borderColor: 'rgba(220, 20, 60, 0.5)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(220, 20, 60, 0.3)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <BaseCard
                      color={colors[resourceType]}
                      width={50}
                      height={75}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {resourceEmojis[resourceType]}
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold',
                      textTransform: 'none',
                      color: 'text.primary'
                    }}
                  >
                    {resourceType}
                  </Typography>
                </Button>
              </Box>
            </Grid2>
          ))}
        </Grid2>
        
        <Box sx={{ 
          marginTop: 3, 
          padding: 2, 
          backgroundColor: 'rgba(220, 20, 60, 0.05)',
          borderRadius: 2,
          border: '1px solid rgba(220, 20, 60, 0.1)'
        }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
            💡 All other players must give you all their cards of the selected resource type
          </Typography>
        </Box>
    </GameModal>
  )
}