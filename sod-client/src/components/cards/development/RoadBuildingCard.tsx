import { Typography, Box } from '@mui/material'
import { BaseCard } from '../BaseCard'
import { Construction } from '@mui/icons-material'

interface Props {
  width?: number
  height?: number
  onClick?: () => void
  disabled?: boolean
}

export function RoadBuildingCard({ width = 80, height = 120, onClick, disabled = false }: Props) {
  return (
    <Box onClick={!disabled ? onClick : undefined}>
      <BaseCard
        color={disabled ? '#888888' : '#228B22'}
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
          <Construction
            sx={{
              fontSize: width * 0.4,
              color: disabled ? '#555555' : '#FFF8DC',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.1, 10),
              fontWeight: 'bold',
              color: disabled ? '#555555' : '#FFF8DC',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            ROAD
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.1, 10),
              fontWeight: 'bold',
              color: disabled ? '#555555' : '#FFF8DC',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              textAlign: 'center',
              lineHeight: 1,
              marginTop: -0.5
            }}
          >
            BUILDING
          </Typography>
        </Box>
      </BaseCard>
    </Box>
  )
}