import React, { useState, useEffect } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useRoom } from '../context/RoomContext'
import { usePlayer } from '../context/PlayerContext'
import { useDeck } from '../hooks/stateHooks'
import { CardVariants } from '../utils/CardVariants'
import { colors } from '../utils/colors'
import { BaseCard } from './cards/BaseCard'
import { CardGroup } from './cards/CardGroup'
import { Player } from '../state/Player'
import { GameModal } from './GameModal'

interface Props {
  open: boolean
  onClose: () => void
  eligiblePlayers: Player[]
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

export function DiscardCardsModal({ open, onClose, eligiblePlayers }: Props) {
  const room = useRoom()
  const player = usePlayer()
  const deck = useDeck()
  const [selectedCards, setSelectedCards] = useState<Record<string, number>>({})

  // Check if current player needs to discard
  const needsToDiscard = player && eligiblePlayers.some(p => p.id === player.id)

  // Get player's resource cards
  const playerResourceCards = deck.filter(
    (card) => card.owner === player?.id && card.type === "Resource"
  )

  // Get available card counts for each resource type
  const availableCards = resourceVariants.reduce((acc, resourceType) => {
    const count = playerResourceCards.filter(card => card.variant === resourceType).length
    if (count > 0) {
      acc[resourceType] = count
    }
    return acc
  }, {} as Record<string, number>)

  // Calculate how many cards need to be discarded (half of total, rounded down)
  const totalCards = playerResourceCards.length
  const cardsToDiscard = Math.floor(totalCards / 2)
  const currentlySelected = Object.values(selectedCards).reduce((sum, count) => sum + count, 0)

  // Reset selected cards when modal opens
  useEffect(() => {
    if (open && needsToDiscard) {
      setSelectedCards({})
    }
  }, [open, needsToDiscard])

  const handleAddResource = (resourceType: string) => {
    const available = availableCards[resourceType] || 0
    const current = selectedCards[resourceType] || 0
    if (currentlySelected >= cardsToDiscard || current >= available) return
    setSelectedCards(prev => ({ ...prev, [resourceType]: current + 1 }))
  }

  const handleRemoveResource = (resourceType: string) => {
    setSelectedCards(prev => {
      const current = prev[resourceType] || 0
      if (current <= 1) {
        const { [resourceType]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [resourceType]: current - 1 }
    })
  }

  const handleConfirmDiscard = () => {
    if (player && currentlySelected === cardsToDiscard) {
      // Convert selectedCards to the required payload format
      const give = Object.entries(selectedCards).map(([resourceType, amount]) => ({
        resourceType,
        amount
      }))
      
      room?.send('DISCARD_RESOURCES', { 
        playerId: player.id,
        give
      })
      setSelectedCards({})
      onClose()
    }
  }

  // Don't show modal if player doesn't need to discard (less than 8 cards) or has no cards
  if (!needsToDiscard || totalCards < 8) {
    return null
  }

  return (
    <GameModal
      open={open}
      onClose={onClose}
      title="🎲 Discard Cards (7 Rolled)"
      accentColor="#ff8c00"
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
      minimizable={{ showLabel: `🎲 Show Discard Cards (${currentlySelected}/${cardsToDiscard})` }}
      disableBackdropClose
      disableEscapeKeyDown
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          You have {totalCards} cards and must discard {cardsToDiscard} cards
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
          Selected: {currentlySelected} / {cardsToDiscard}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {/* Left: Available resources to click */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 140, 0, 0.08)',
            borderRadius: 2,
            border: '2px solid rgba(255, 140, 0, 0.3)',
            minHeight: 220,
          }}
        >
          <Typography variant="subtitle2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1.5 }}>
            Your Resources
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {Object.entries(availableCards).map(([resourceType, available]) => {
              const selected = selectedCards[resourceType] || 0
              const disabled = currentlySelected >= cardsToDiscard || selected >= available
              return (
                <Box key={resourceType} sx={{ textAlign: 'center' }}>
                  <Box
                    onClick={() => !disabled && handleAddResource(resourceType)}
                    sx={{
                      position: 'relative',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.5 : 1,
                      '&:hover': disabled ? {} : { transform: 'scale(1.05)' },
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <BaseCard color={colors[resourceType]} width={60} height={90} />
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
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.75, fontWeight: 600 }}>
                    {resourceType}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Available: {available - selected}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Right: Selection to discard */}
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 140, 0, 0.05)',
            borderRadius: 2,
            border: currentlySelected > 0 ? '2px solid rgba(255, 140, 0, 0.6)' : '2px dashed rgba(0,0,0,0.2)',
            minHeight: 220,
          }}
        >
          <Typography variant="subtitle2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1.5 }}>
            Will Discard
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
            {currentlySelected === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Click a resource to add it here
              </Typography>
            ) : (
              Object.entries(selectedCards).map(([resourceType, count]) => (
                <Box key={resourceType} sx={{ textAlign: 'center' }}>
                  <Box
                    onClick={() => handleRemoveResource(resourceType)}
                    sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s ease' }}
                  >
                    <CardGroup color={colors[resourceType]} count={count} maxSpacing={1} />
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
                    {resourceType} x{count}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
          <Typography variant="caption" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            Tip: Click a card here to remove it from your selection
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleConfirmDiscard}
          disabled={currentlySelected !== cardsToDiscard}
          sx={{
            backgroundColor: currentlySelected === cardsToDiscard ? '#ff8c00' : '#ccc',
            color: currentlySelected === cardsToDiscard ? '#000' : '#666',
            fontWeight: 'bold',
            px: 4,
            py: 1.2,
            '&:hover': { backgroundColor: currentlySelected === cardsToDiscard ? '#ff7a00' : '#ccc' },
            '&:disabled': { backgroundColor: '#ccc', color: '#666' },
          }}
        >
          {currentlySelected === cardsToDiscard
            ? 'Discard Selected Cards'
            : `Select ${cardsToDiscard - currentlySelected} more card${cardsToDiscard - currentlySelected !== 1 ? 's' : ''}`}
        </Button>
      </Box>
    </GameModal>
  )
}