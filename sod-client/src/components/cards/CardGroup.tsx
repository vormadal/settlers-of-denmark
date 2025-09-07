import { Box, Typography } from '@mui/material'
import { BaseCard } from './BaseCard'

interface Props {
  color: string
  count: number
  maxSpacing?: number // Optional override for spacing
  onClick?: () => void // Optional click handler
}
const cardWidth = 40 // Increased from 32 for better visibility
const cardHeight = 60 // Increased from 48 for better visibility
const minSpacing = 1 // Minimum spacing between cards (reduced from 2)
const defaultMaxSpacing = 8 // Default maximum spacing between cards

// Export for use in PlayerCards
export const CARD_WIDTH = cardWidth
export const MIN_SPACING = minSpacing
export const DEFAULT_MAX_SPACING = defaultMaxSpacing
export function CardGroup({ color, count, maxSpacing = defaultMaxSpacing, onClick }: Props) {
  if (count === 0) return null
  
  // Calculate spacing based on constraints
  const calculateSpacing = (count: number): number => {
    if (count === 1) return 0
    return Math.max(minSpacing, Math.min(maxSpacing, maxSpacing))
  }
  
  const spacing = calculateSpacing(count)
  const groupWidth = cardWidth + (count - 1) * spacing
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexShrink: 0,
        marginRight: '0.5rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'relative',
          width: groupWidth,
          height: cardHeight,
          '&:hover .card': {
            transform: 'translateY(-2px)',
          }
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={`${color}-${index}`}
            className="card"
            sx={{
              position: 'absolute',
              left: index * spacing,
              top: 0,
              zIndex: index + 1, // Stack cards with increasing z-index
            }}
          >
            <BaseCard
              color={color}
              width={cardWidth}
              height={cardHeight}
            />
          </Box>
        ))}
        
        {/* Card count indicator - positioned on the last (top) card */}
        {count > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: (count - 1) * spacing + cardWidth / 2, // Center of the last card
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: '50%',
              minWidth: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              zIndex: count + 10, // Ensure it's above all cards
              border: '2px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
              {count}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
