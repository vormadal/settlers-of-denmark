import { Box } from '@mui/material'

interface Props {
  children?: React.ReactNode
  color?: string
  width: number
  height: number
}
export function BaseCard({ children, color, width, height }: Props) {
  return (
    <Box
      sx={{
        background: `linear-gradient(145deg, ${color || '#ffffff'} 0%, ${color || '#ffffff'}CC 100%)`,
        borderRadius: '8px',
        width: width,
        height: height,
        boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        border: '2px solid rgba(255,255,255,0.8)',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '&:hover': {
          transform: 'translateY(-1px) scale(1.02)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: '8px 8px 0 0',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative', // Changed from absolute to relative
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
