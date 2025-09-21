import { Box, Typography } from '@mui/material'
import { DevelopmentCard } from './development/DevelopmentCard'
import { Card } from '../../state/Card'
import { CardTypes } from '../../utils/CardTypes'

interface Props {
  cards: Card[]
  onCardClick?: (card: Card) => void
  maxWidth?: number
  title?: string
  disabled?: boolean
  currentRound?: number
}

const cardWidth = 40
const cardHeight = 60

export function DevelopmentCards({ cards, onCardClick, maxWidth = 400, title = "Development Cards", disabled = false, currentRound }: Props) {
  // Filter only development cards
  const developmentCards = cards.filter(card => card.type === CardTypes.Development)
  
  // Group cards by variant for display
  const cardGroups = developmentCards.reduce((groups, card) => {
    if (!groups[card.variant]) {
      groups[card.variant] = []
    }
    groups[card.variant].push(card)
    return groups
  }, {} as Record<string, Card[]>)

  // Check if a variant can be played (has at least one card not bought this turn)
  const canPlayVariant = (variant: string): { canPlay: boolean; playableCard: Card | null } => {
    if (disabled) {
      return { canPlay: false, playableCard: null }
    }
    
    const cards = cardGroups[variant] || []
    const playableCard = currentRound !== undefined 
      ? cards.find(card => card.boughtInTurn !== currentRound)
      : cards[0] // If no round info, allow playing the first card
    
    return { canPlay: !!playableCard, playableCard: playableCard || null }
  }

  if (developmentCards.length === 0) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ marginBottom: 1, opacity: 0.7 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          No development cards
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ padding: 2, maxWidth }}>
      <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
        {title} ({developmentCards.length})
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {Object.entries(cardGroups).map(([variant, variantCards]) => {
          const { canPlay, playableCard } = canPlayVariant(variant)
          
          return (
            <Box
              key={variant}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Show one card representing the group */}
              <Box
                sx={{
                  position: 'relative',
                  cursor: (onCardClick && canPlay) ? 'pointer' : 'default'
                }}
                onClick={(onCardClick && canPlay && playableCard) ? () => onCardClick(playableCard) : undefined}
              >
                <DevelopmentCard
                  variant={variant}
                  width={cardWidth}
                  height={cardHeight}
                  onClick={(onCardClick && canPlay && playableCard) ? () => onCardClick(playableCard) : undefined}
                  disabled={!canPlay}
                />
              
              {/* Stack effect for multiple cards */}
              {variantCards.length > 1 && (
                <>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      zIndex: -1,
                      opacity: 0.7
                    }}
                  >
                    <DevelopmentCard
                      variant={variant}
                      width={cardWidth}
                      height={cardHeight}
                      disabled={true}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      zIndex: -2,
                      opacity: 0.4
                    }}
                  >
                    <DevelopmentCard
                      variant={variant}
                      width={cardWidth}
                      height={cardHeight}
                      disabled={true}
                    />
                  </Box>
                </>
              )}
              
              {/* Count badge */}
              {variantCards.length > 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#2196F3',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 10
                  }}
                >
                  {variantCards.length}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
      </Box>
    </Box>
  )
}