import { Box } from '@mui/material'
import { BaseCard } from './BaseCard'

interface Props {
  color: string
  count: number
}
const spacing = 5
const cardWidth = 40
const cardHeight = 60
export function CardGroup({ color, count }: Props) {
  if (count === 0) return null
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          position: 'relative',
          flex: '1',
          width: cardWidth + count * spacing,
          height: cardHeight,
          marginBottom: '1rem'
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
