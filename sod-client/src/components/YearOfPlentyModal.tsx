import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Grid2,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useRoom } from '../context/RoomContext'
import { usePlayer } from '../context/PlayerContext'
import { CardVariants } from '../utils/CardVariants'
import { colors } from '../utils/colors'
import { BaseCard } from './cards/BaseCard'
import { CardGroup } from './cards/CardGroup'

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

interface ResourceSelection {
  [resourceType: string]: number
}

export function YearOfPlentyModal({ open, onClose }: Props) {
  const room = useRoom()
  const player = usePlayer()
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedResources, setSelectedResources] = useState<ResourceSelection>({})

  const totalSelected = Object.values(selectedResources).reduce((sum, count) => sum + count, 0)
  const maxResources = 2
  const canSelect = totalSelected < maxResources

  const handleResourceClick = (resourceType: string) => {
    if (canSelect) {
      setSelectedResources(prev => ({
        ...prev,
        [resourceType]: (prev[resourceType] || 0) + 1
      }))
    }
  }

  const handleRemoveResource = (resourceType: string) => {
    setSelectedResources(prev => {
      const newSelection = { ...prev }
      if (newSelection[resourceType] > 1) {
        newSelection[resourceType]--
      } else {
        delete newSelection[resourceType]
      }
      return newSelection
    })
  }

  const handleConfirm = () => {
    if (totalSelected === maxResources && player) {
      const receive = Object.entries(selectedResources).map(([resourceType, amount]) => ({
        resourceType,
        amount
      }))

      room?.send('SELECT_YEAR_OF_PLENTY_RESOURCES', {
        playerId: player.id,
        receive
      })
      
      // Reset state
      setSelectedResources({})
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedResources({})
    onClose()
  }

  return (
    <>
      <Dialog
        open={open && !isMinimized}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#f5f5f5',
            backgroundImage: 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderBottom: '2px solid rgba(255, 193, 7, 0.3)',
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            🌟 Year of Plenty Card
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => setIsMinimized(true)}
              sx={{
                minWidth: 'auto',
                padding: '4px 8px',
                fontSize: '0.75rem'
              }}
            >
              Hide
            </Button>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ padding: 3 }}>
          <Typography variant="body1" sx={{ marginBottom: 2, textAlign: 'center' }}>
            Choose any 2 resource cards from the bank:
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              marginBottom: 3, 
              textAlign: 'center',
              color: 'text.secondary' 
            }}
          >
            Selected: {totalSelected} / {maxResources}
          </Typography>

          {/* Available Resources Grid */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="subtitle2" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
              Available Resources:
            </Typography>
            <Grid2 container spacing={2} justifyContent="center">
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
                      onClick={() => handleResourceClick(resourceType)}
                      disabled={!canSelect}
                      sx={{
                        padding: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: canSelect 
                          ? 'rgba(255, 193, 7, 0.05)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        border: '2px solid rgba(255, 193, 7, 0.3)',
                        borderRadius: 2,
                        minHeight: 100,
                        minWidth: 80,
                        '&:hover': canSelect ? {
                          backgroundColor: 'rgba(255, 193, 7, 0.1)',
                          borderColor: 'rgba(255, 193, 7, 0.5)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                        } : {},
                        '&:disabled': {
                          opacity: 0.5,
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
          </Box>

          {/* Selected Resources Display */}
          {totalSelected > 0 && (
            <Box 
              sx={{
                padding: 2,
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderRadius: 2,
                border: '2px solid rgba(255, 193, 7, 0.3)',
                marginBottom: 3
              }}
            >
              <Typography variant="subtitle2" sx={{ marginBottom: 1, fontWeight: 'bold', textAlign: 'center' }}>
                Your Selection:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {Object.entries(selectedResources).map(([resourceType, count]) => (
                  <Box key={resourceType} sx={{ textAlign: 'center' }}>
                    <Box
                      onClick={() => handleRemoveResource(resourceType)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { transform: 'scale(1.1)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <CardGroup
                        color={colors[resourceType]}
                        count={count}
                        maxSpacing={1}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, fontWeight: 'bold' }}
                    >
                      {resourceType} x{count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Instructions */}
          <Box sx={{
            marginBottom: 3,
            padding: 2,
            backgroundColor: 'rgba(255, 193, 7, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(255, 193, 7, 0.2)'
          }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
              💡 Click on resources above to add them to your selection. Click selected resources to remove them.
            </Typography>
          </Box>

          {/* Confirm Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={totalSelected !== maxResources}
              sx={{
                backgroundColor: totalSelected === maxResources ? '#ffc107' : '#ccc',
                color: totalSelected === maxResources ? '#000' : '#666',
                fontWeight: 'bold',
                px: 4,
                py: 1,
                '&:hover': {
                  backgroundColor: totalSelected === maxResources ? '#ffb300' : '#ccc',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666',
                }
              }}
            >
              {totalSelected === maxResources 
                ? 'Take Resources' 
                : `Select ${maxResources - totalSelected} more resource${maxResources - totalSelected !== 1 ? 's' : ''}`
              }
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Show/Hide Button - positioned like other modals */}
      {open && isMinimized && (
        <Button
          variant="outlined"
          onClick={() => setIsMinimized(false)}
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1300,
            fontWeight: 700,
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: 3,
            borderWidth: 2,
            backdropFilter: 'blur(2px)',
            background: 'rgba(255,255,255,0.4)',
            borderColor: 'rgba(255, 193, 7, 0.6)',
            color: 'rgba(255, 193, 7, 0.9)',
            '&:hover': {
              background: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255, 193, 7, 0.8)',
              color: 'rgba(255, 193, 7, 1)',
            }
          }}
        >
          🌟 Show Year of Plenty
        </Button>
      )}
    </>
  )
}