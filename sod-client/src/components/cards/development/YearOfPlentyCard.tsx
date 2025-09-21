import { Typography, Box, Tooltip } from '@mui/material'
import { BaseCard } from '../BaseCard'
import { Agriculture, Landscape } from '@mui/icons-material'

interface Props {
  width?: number
  height?: number
  onClick?: () => void
  disabled?: boolean
}

export function YearOfPlentyCard({ width = 80, height = 120, onClick, disabled = false }: Props) {
  return (
    <Tooltip title="Year of Plenty Card" arrow>
      <Box onClick={!disabled ? onClick : undefined}>
      <BaseCard
        color={disabled ? '#B0E0B0' : '#32CD32'}
        width={width}
        height={height}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            padding: 1,
            opacity: disabled ? 0.8 : 1, // Less transparent when disabled
            filter: disabled ? 'grayscale(0.5)' : 'none', // Subtle grayscale when disabled
            cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : 'default')
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Agriculture
              sx={{
                fontSize: width * 0.25,
                color: disabled ? '#555555' : '#FFF8DC',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))'
              }}
            />
            <Landscape
              sx={{
                fontSize: width * 0.25,
                color: disabled ? '#555555' : '#FFF8DC',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))'
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.09, 9),
              fontWeight: 'bold',
              color: disabled ? '#555555' : '#FFF8DC',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            YEAR OF
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: Math.min(width * 0.09, 9),
              fontWeight: 'bold',
              color: disabled ? '#555555' : '#FFF8DC',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              textAlign: 'center',
              lineHeight: 1,
              marginTop: -0.5
            }}
          >
            PLENTY
          </Typography>
        </Box>
      </BaseCard>
      </Box>
    </Tooltip>
  )
}