import { Box, Typography } from '@mui/material'
import React from 'react'

interface Props {
  children: React.ReactNode
  count: number
  label: string
  compact?: boolean
  onClick?: () => void
  sx?: object
}

export function CartoonStatCard({ children, count, label, compact = false, onClick, sx }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        background: 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%)',
        borderRadius: compact ? '4px' : '6px',
        padding: compact ? '4px 2px' : '6px 4px',
        minWidth: compact ? '28px' : '38px',
        maxWidth: compact ? '32px' : '42px',
        textAlign: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
        border: `1px solid rgba(0,0,0,0.15)`,
        transition: 'all 0.2s ease-out',
        '&:hover': {
          transform: compact ? 'translateY(-1px) scale(1.02)' : 'translateY(-2px) scale(1.03)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.7)',
        },
        position: 'relative',
        overflow: 'hidden',
        ...sx
      }}
      title={label}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: compact ? '2px' : '4px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontSize: compact ? '0.65rem' : '0.75rem',
            fontWeight: 700,
            color: 'rgba(0,0,0,0.85)',
            textShadow: '0 1px 1px rgba(255,255,255,0.6)',
            lineHeight: 1,
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  )
}
