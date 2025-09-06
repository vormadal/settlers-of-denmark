import { Box, Typography } from '@mui/material'

interface Props {
  icon: string
  count: number
  color: string
  label: string
  compact?: boolean
}

export function CartoonStatCard({ icon, count, color, label, compact = false }: Props) {
  return (
    <Box
      sx={{
        background: `linear-gradient(145deg, ${color} 0%, ${color}CC 100%)`,
        borderRadius: compact ? '8px' : '12px',
        padding: compact ? '4px 3px' : '8px 6px',
        minWidth: compact ? '32px' : '45px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: compact ? '1px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.8)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: compact ? 'translateY(-1px) scale(1.02)' : 'translateY(-2px) scale(1.05)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: compact ? '8px 8px 0 0' : '12px 12px 0 0',
        },
      }}
      title={label}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontSize: compact ? '1rem' : '1.4rem',
          lineHeight: '1.2',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {icon}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: compact ? '0.75rem' : '1rem',
          fontWeight: 800,
          color: 'rgba(0,0,0,0.8)',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          position: 'relative',
          zIndex: 1,
          marginTop: compact ? '-1px' : '-2px',
        }}
      >
        {count}
      </Typography>
    </Box>
  )
}
