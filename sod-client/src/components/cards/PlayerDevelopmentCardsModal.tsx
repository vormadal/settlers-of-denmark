import React, { useState } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box, 
  Typography,
  Tooltip 
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { DevelopmentCard } from './development/DevelopmentCard'
import { useDeck } from '../../hooks/stateHooks'
import { usePlayer } from '../../context/PlayerContext'
import { useRoom } from '../../context/RoomContext'
import { CardTypes } from '../../utils/CardTypes'
import { Card } from '../../state/Card'

interface Props {
  open: boolean
  onClose: () => void
}

const cardWidth = 40
const cardHeight = 60

export function PlayerDevelopmentCardsModal({ open, onClose }: Props) {
  const deck = useDeck()
  const player = usePlayer()
  const room = useRoom()

  // Get player's development cards
  const playerDevCards = deck.filter((card: Card) => 
    card.owner === player?.id && card.type === CardTypes.Development
  )

  // Group cards by variant
  const cardGroups = playerDevCards.reduce((groups, card) => {
    if (!groups[card.variant]) {
      groups[card.variant] = []
    }
    groups[card.variant].push(card)
    return groups
  }, {} as Record<string, Card[]>)

  const handlePlayCard = (card: Card) => {
    // Send message to server to play the development card
    room?.send('PLAY_DEVELOPMENT_CARD', { cardId: card.id })
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#f5f5f5',
          backgroundImage: 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderBottom: '2px solid rgba(139, 69, 19, 0.2)'
      }}>
        <Typography variant="h6" component="div">
          My Development Cards ({playerDevCards.length})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ padding: 3 }}>
        {playerDevCards.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            padding: 4,
            opacity: 0.7 
          }}>
            <Typography variant="h6">No Development Cards</Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Buy development cards from the deck to see them here
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 3,
              justifyItems: 'center',
              alignItems: 'start'
            }}
          >
            {Object.entries(cardGroups).map(([variant, cards]) => (
              <Box
                key={variant}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Tooltip 
                  title={`Click to play ${variant} card`}
                  arrow
                >
                  <Box>
                    <DevelopmentCard
                      variant={variant}
                      width={cardWidth}
                      height={cardHeight}
                      onClick={() => handlePlayCard(cards[0])}
                    />
                  </Box>
                </Tooltip>
                
                {cards.length > 1 && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(33, 150, 243, 0.3)'
                    }}
                  >
                    × {cards.length}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
        
        {playerDevCards.length > 0 && (
          <Box sx={{ 
            marginTop: 3, 
            padding: 2, 
            backgroundColor: 'rgba(139, 69, 19, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(139, 69, 19, 0.1)'
          }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
              💡 Click on any card to play it
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}