import { Box } from '@mui/material'
import { BaseCard } from './BaseCard'

interface Props {
  color: string
  count: number
}
const spacing = 4 // Reduced from 8 for more compact layout
const cardWidth = 32 // Reduced from 40 for mobile
const cardHeight = 48 // Reduced from 60 for mobile
export function CardGroup({ color, count }: Props) {
  if (count === 0) return null
  return (
    <Box sx={{ display: 'flex', flexShrink: 0 }}>
      <Box
        sx={{
          position: 'relative',
          flex: '1',
          width: cardWidth + (count - 1) * spacing, // More efficient width calculation
          height: cardHeight,
          marginRight: '0.25rem', // Small gap between card groups
          '&:hover .card': {
            transform: 'translateY(-2px)',
          }
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <BaseCard
            key={`${color}-${index}`}
            color={color}
            offset={index * spacing}
            width={cardWidth}
            height={cardHeight}
          />
        ))}
      </Box>
    </Box>
  )
}
