import React from 'react'
import { Box, Typography } from '@mui/material'

interface Props {
  count: number
  label: string
  children: React.ReactNode
  compact?: boolean
}

export function CartoonStatCard({ count, label, children, compact = false }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255,255,255,0.9)',
        borderRadius: compact ? '6px' : '8px',
        padding: compact ? '3px 4px' : '4px 6px', // Reduced padding
        minWidth: compact ? '28px' : '36px', // Reduced minimum width
        minHeight: compact ? '32px' : '40px', // Reduced minimum height
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
        },
      }}
      title={label}
    >
      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: compact ? 0.25 : 0.5, // Reduced margin
        }}
      >
        {children}
      </Box>
      
      {/* Count */}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          fontSize: compact ? '0.65rem' : '0.75rem', // Smaller font sizes
          color: 'rgba(0,0,0,0.8)',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        {count}
      </Typography>
    </Box>
  )
}
