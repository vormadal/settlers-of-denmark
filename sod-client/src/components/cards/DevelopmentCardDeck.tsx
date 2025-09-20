import { Box, Typography, Tooltip, Badge } from '@mui/material'
import { BaseCard } from './BaseCard'
import { CardVariants } from '../../utils/CardVariants'
import { 
  KnightCard, 
  VictoryPointCard, 
  RoadBuildingCard, 
  MonopolyCard, 
  YearOfPlentyCard, 
  MerchantCard 
} from './development'

interface Props {
  remainingCards: number
  onClick?: () => void
  disabled?: boolean
  canAfford?: boolean
  width?: number
  height?: number
}

const cardWidth = 40
const cardHeight = 60

export function DevelopmentCardDeck({ 
  remainingCards, 
  onClick, 
  disabled = false, 
  canAfford = true,
  width = cardWidth,
  height = cardHeight
}: Props) {
  const isClickable = !disabled && canAfford && remainingCards > 0 && onClick
  
  // Sample card to show on top of the deck (rotates through different types)
  const getSampleCard = () => {
    const cardType = remainingCards % 6 // Cycle through 6 types based on remaining cards
    const cardProps = {
      width: width * 0.9,
      height: height * 0.9,
      disabled: !isClickable
    }
    
    switch (cardType) {
      case 0:
        return <KnightCard {...cardProps} />
      case 1:
        return <VictoryPointCard {...cardProps} />
      case 2:
        return <RoadBuildingCard {...cardProps} />
      case 3:
        return <MonopolyCard {...cardProps} />
      case 4:
        return <YearOfPlentyCard {...cardProps} />
      case 5:
        return <MerchantCard {...cardProps} />
      default:
        return <KnightCard {...cardProps} />
    }
  }

  const tooltipTitle = () => {
    if (remainingCards === 0) return "No development cards remaining"
    if (!canAfford) return "Cannot afford development card (Costs: 1 Ore, 1 Grain, 1 Wool)"
    if (disabled) return "Cannot buy development cards right now"
    return `Buy development card (${remainingCards} remaining)`
  }

  return (
    <Tooltip title={tooltipTitle()} arrow>
      <Box
        onClick={isClickable ? onClick : undefined}
        sx={{
          position: 'relative',
          width: width,
          height: height,
          cursor: isClickable ? 'pointer' : 'not-allowed',
          transition: 'transform 0.2s ease',
          '&:hover': isClickable ? {
            transform: 'translateY(-2px) scale(1.02)',
          } : {},
        }}
      >
        {/* Stack effect - multiple cards behind */}
        {remainingCards > 1 && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 1,
              }}
            >
              <BaseCard
                color={!isClickable ? '#888888' : '#4A4A4A'}
                width={width * 0.95}
                height={height * 0.95}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 2,
                left: 2,
                zIndex: 2,
              }}
            >
              <BaseCard
                color={!isClickable ? '#888888' : '#5A5A5A'}
                width={width * 0.97}
                height={height * 0.97}
              />
            </Box>
          </>
        )}
        
        {/* Top card */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
          }}
        >
          {remainingCards > 0 ? getSampleCard() : (
            <BaseCard
              color="#CCCCCC"
              width={width}
              height={height}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: Math.min(width * 0.1, 12),
                  fontWeight: 'bold',
                  color: '#888888',
                  textAlign: 'center'
                }}
              >
                EMPTY
              </Typography>
            </BaseCard>
          )}
        </Box>
        
        {/* Card count badge */}
        {remainingCards > 0 && (
          <Badge
            badgeContent={remainingCards}
            color="primary"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              zIndex: 10,
              '& .MuiBadge-badge': {
                backgroundColor: canAfford && !disabled ? '#2196F3' : '#757575',
                color: 'white',
                fontWeight: 'bold',
                minWidth: 24,
                height: 24,
                borderRadius: '50%',
                fontSize: '0.75rem',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }
            }}
          />
        )}
        
        {/* Cost indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: canAfford ? '#4CAF50' : '#F44336',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            zIndex: 5,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          🏔️ 🌾 🐑
        </Box>
      </Box>
    </Tooltip>
  )
}