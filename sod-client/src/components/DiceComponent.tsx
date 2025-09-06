import { Box } from '@mui/material'
import React from 'react'

interface DiceProps {
  value: number
  color: string
  disabled?: boolean
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
}

const DiceComponent: React.FC<DiceProps> = ({ value, color, disabled = false, onClick, size = 'medium' }) => {
  // Size configurations
  const sizeConfig = {
    small: { width: 40, height: 40, dotSize: 6, fontSize: '14px' },
    medium: { width: 60, height: 60, dotSize: 8, fontSize: '18px' },
    large: { width: 80, height: 80, dotSize: 10, fontSize: '24px' }
  }
  
  const config = sizeConfig[size]

  // Create dots pattern based on dice value
  const getDots = (value: number) => {
    const dots = []
    const dotStyle = {
      width: config.dotSize,
      height: config.dotSize,
      borderRadius: '50%',
      backgroundColor: '#fff',
      position: 'absolute' as const
    }

    switch (value) {
      case 1:
        dots.push(<Box key="center" sx={{ ...dotStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />)
        break
      case 2:
        dots.push(<Box key="top-left" sx={{ ...dotStyle, top: '20%', left: '20%' }} />)
        dots.push(<Box key="bottom-right" sx={{ ...dotStyle, bottom: '20%', right: '20%' }} />)
        break
      case 3:
        dots.push(<Box key="top-left" sx={{ ...dotStyle, top: '20%', left: '20%' }} />)
        dots.push(<Box key="center" sx={{ ...dotStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />)
        dots.push(<Box key="bottom-right" sx={{ ...dotStyle, bottom: '20%', right: '20%' }} />)
        break
      case 4:
        dots.push(<Box key="top-left" sx={{ ...dotStyle, top: '20%', left: '20%' }} />)
        dots.push(<Box key="top-right" sx={{ ...dotStyle, top: '20%', right: '20%' }} />)
        dots.push(<Box key="bottom-left" sx={{ ...dotStyle, bottom: '20%', left: '20%' }} />)
        dots.push(<Box key="bottom-right" sx={{ ...dotStyle, bottom: '20%', right: '20%' }} />)
        break
      case 5:
        dots.push(<Box key="top-left" sx={{ ...dotStyle, top: '20%', left: '20%' }} />)
        dots.push(<Box key="top-right" sx={{ ...dotStyle, top: '20%', right: '20%' }} />)
        dots.push(<Box key="center" sx={{ ...dotStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />)
        dots.push(<Box key="bottom-left" sx={{ ...dotStyle, bottom: '20%', left: '20%' }} />)
        dots.push(<Box key="bottom-right" sx={{ ...dotStyle, bottom: '20%', right: '20%' }} />)
        break
      case 6:
        dots.push(<Box key="top-left" sx={{ ...dotStyle, top: '20%', left: '20%' }} />)
        dots.push(<Box key="top-right" sx={{ ...dotStyle, top: '20%', right: '20%' }} />)
        dots.push(<Box key="middle-left" sx={{ ...dotStyle, top: '50%', left: '20%', transform: 'translateY(-50%)' }} />)
        dots.push(<Box key="middle-right" sx={{ ...dotStyle, top: '50%', right: '20%', transform: 'translateY(-50%)' }} />)
        dots.push(<Box key="bottom-left" sx={{ ...dotStyle, bottom: '20%', left: '20%' }} />)
        dots.push(<Box key="bottom-right" sx={{ ...dotStyle, bottom: '20%', right: '20%' }} />)
        break
      default:
        // Fallback to number display for values outside 1-6
        return (
          <Box sx={{ 
            color: '#fff', 
            fontSize: config.fontSize, 
            fontWeight: 'bold',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            {value}
          </Box>
        )
    }

    return dots
  }

  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        width: config.width,
        height: config.height,
        borderRadius: size === 'small' ? '8px' : '12px',
        backgroundColor: color,
        border: size === 'small' ? '1px solid #333' : '2px solid #333',
        position: 'relative',
        cursor: !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        boxShadow: size === 'small' 
          ? '2px 2px 4px rgba(0,0,0,0.3)' 
          : '4px 4px 8px rgba(0,0,0,0.3)',
        '&:hover': !disabled ? {
          transform: size === 'small' ? 'scale(1.02)' : 'scale(1.05)',
          boxShadow: size === 'small' 
            ? '3px 3px 6px rgba(0,0,0,0.4)' 
            : '6px 6px 12px rgba(0,0,0,0.4)'
        } : {},
        flexShrink: 0
      }}
    >
      {getDots(value)}
    </Box>
  )
}

export default DiceComponent
