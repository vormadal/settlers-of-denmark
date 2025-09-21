import { Typography, Box, Tooltip } from '@mui/material'
import { BaseCard } from '../BaseCard'
import { Shield } from '@mui/icons-material'

interface Props {
  width?: number
  height?: number
  onClick?: () => void
  disabled?: boolean
}

export function KnightCard({ width = 80, height = 120, onClick, disabled = false }: Props) {
  return (
    <Tooltip title="Knight Card" arrow>
      <Box onClick={!disabled ? onClick : undefined}>
        <BaseCard
          color={disabled ? '#B0B0B0' : '#8B4513'}
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
            opacity: disabled ? 0.8 : 1, // Less transparent when disabled
            cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : 'default'),
            filter: disabled ? 'grayscale(0.5)' : 'none' // Subtle grayscale when disabled
          }}
        >
          <Shield
            sx={{
              fontSize: width * 0.4,
              color: disabled ? '#666666' : '#FFF8DC', // Better contrast when disabled
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.12, 12),
              fontWeight: 'bold',
              color: disabled ? '#666666' : '#FFF8DC', // Better contrast when disabled
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            KNIGHT
          </Typography>
        </Box>
      </BaseCard>
      </Box>
    </Tooltip>
  )
}