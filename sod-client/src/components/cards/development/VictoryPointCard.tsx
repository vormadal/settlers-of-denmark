import { Typography, Box } from '@mui/material'
import { BaseCard } from '../BaseCard'
import { Star } from '@mui/icons-material'

interface Props {
  width?: number
  height?: number
  onClick?: () => void
  disabled?: boolean
}

export function VictoryPointCard({ width = 80, height = 120, onClick, disabled = false }: Props) {
  return (
    <Box onClick={!disabled ? onClick : undefined}>
      <BaseCard
        color={disabled ? '#888888' : '#FFD700'}
        width={width}
        height={height}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            padding: 1,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : 'default')
          }}
        >
          <Star
            sx={{
              fontSize: width * 0.4,
              color: disabled ? '#555555' : '#8B4513',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.1, 10),
              fontWeight: 'bold',
              color: disabled ? '#555555' : '#8B4513',
              textShadow: '1px 1px 2px rgba(255,255,255,0.7)',
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            VICTORY
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.1, 10),
              fontWeight: 'bold',
              color: disabled ? '#555555' : '#8B4513',
              textShadow: '1px 1px 2px rgba(255,255,255,0.7)',
              textAlign: 'center',
              lineHeight: 1,
              marginTop: -0.5
            }}
          >
            POINT
          </Typography>
        </Box>
      </BaseCard>
    </Box>
  )
}