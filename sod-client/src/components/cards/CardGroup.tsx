import { Box } from '@mui/material'
import { BaseCard } from './BaseCard'

interface Props {
  color: string
  count: number
}
export function CardGroup({ color, count }: Props) {
  if(count === 0) return null
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          position: 'relative',
          flex: '1',
          width: 60 + count * 10,
          height: 80,
          marginBottom: '1rem'
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <BaseCard
            key={`${color}-${index}`}
            color={color}
            offset={index * 10}
          />
        ))}
      </Box>
    </Box>
  )
}
