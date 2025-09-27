import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
} from '@mui/material'
import { useRoom } from '../context/RoomContext'
import { usePlayer } from '../context/PlayerContext'
import { CardVariants } from '../utils/CardVariants'
import { colors } from '../utils/colors'
import { BaseCard } from './cards/BaseCard'
import { CardGroup } from './cards/CardGroup'
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

interface ResourceSelection {
  [resourceType: string]: number
}

export function YearOfPlentyModal({ open, onClose }: Props) {
  const room = useRoom()
  const player = usePlayer()
  const [selectedResources, setSelectedResources] = useState<ResourceSelection>({})

  const totalSelected = Object.values(selectedResources).reduce((sum, count) => sum + count, 0)
  const maxResources = 2
  const canSelectMore = totalSelected < maxResources

  const handleAddResource = (resourceType: string) => {
    if (!canSelectMore) return
    setSelectedResources(prev => ({
      ...prev,
      [resourceType]: (prev[resourceType] || 0) + 1
    }))
  }

  const handleRemoveResource = (resourceType: string) => {
    setSelectedResources(prev => {
      if (!prev[resourceType]) return prev

      const nextSelection = { ...prev }
      const nextCount = nextSelection[resourceType] - 1

      if (nextCount <= 0) {
        delete nextSelection[resourceType]
      } else {
        nextSelection[resourceType] = nextCount
      }

      return nextSelection
    })
  }

  const resetSelection = () => setSelectedResources({})

  const handleClose = () => {
    resetSelection()
    onClose()
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

      handleClose()
    }
  }

  return (
    <GameModal
      open={open}
      onClose={handleClose}
      title="🌟 Year of Plenty Card"
      accentColor="#ffc107"
      maxWidth={false}
      fullWidth
      contentSx={{
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
      paperSx={{
        width: '100%',
        maxWidth: 720,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Choose any 2 resource cards from the bank
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.5, color: 'text.secondary' }}
        >
          Selected: {totalSelected} / {maxResources}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 193, 7, 0.08)',
            borderRadius: 2,
            border: '2px solid rgba(255, 193, 7, 0.3)',
            minHeight: 220,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1.5 }}
          >
            Bank Resources
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'center',
            }}
          >
            {resourceVariants.map((resourceType) => {
              const selectedCount = selectedResources[resourceType] || 0
              const disabled = !canSelectMore

              return (
                <Box key={resourceType} sx={{ textAlign: 'center' }}>
                  <Box
                    onClick={() => handleAddResource(resourceType)}
                    sx={{
                      position: 'relative',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.5 : 1,
                      '&:hover': disabled
                        ? {}
                        : {
                            transform: 'scale(1.05)',
                          },
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <BaseCard
                      color={colors[resourceType]}
                      width={60}
                      height={90}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '1.8rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                      }}
                    >
                      {resourceEmojis[resourceType]}
                    </Box>
                    {selectedCount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          backgroundColor: 'rgba(255, 193, 7, 0.85)',
                          color: '#000',
                          borderRadius: '50%',
                          minWidth: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {selectedCount}
                      </Box>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.75 }}>
                    {resourceType}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 193, 7, 0.05)',
            borderRadius: 2,
            border:
              totalSelected > 0
                ? '2px solid rgba(255, 193, 7, 0.6)'
                : '2px dashed rgba(0,0,0,0.2)',
            minHeight: 220,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1.5 }}
          >
            Your Selection
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 120,
            }}
          >
            {totalSelected === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontStyle: 'italic' }}
              >
                Click a resource to add it here
              </Typography>
            ) : (
              Object.entries(selectedResources).map(([resourceType, count]) => (
                <Box key={resourceType} sx={{ textAlign: 'center' }}>
                  <Box
                    onClick={() => handleRemoveResource(resourceType)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.05)' },
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <CardGroup
                      color={colors[resourceType]}
                      count={count}
                      maxSpacing={1}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
                    {resourceType} x{count}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
          >
            Tip: Click a card here to remove it from your selection
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={totalSelected !== maxResources}
          sx={{
            backgroundColor: totalSelected === maxResources ? '#ffc107' : '#ccc',
            color: totalSelected === maxResources ? '#000' : '#666',
            fontWeight: 'bold',
            px: 4,
            py: 1.2,
            '&:hover': {
              backgroundColor: totalSelected === maxResources ? '#ffb300' : '#ccc',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
              color: '#666',
            },
          }}
        >
          {totalSelected === maxResources
            ? 'Take Resources'
            : `Select ${maxResources - totalSelected} more card${maxResources - totalSelected !== 1 ? 's' : ''}`}
        </Button>
      </Box>
    </GameModal>
  )
}