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
    const dotClasses = `w-[${config.dotSize}px] h-[${config.dotSize}px] rounded-full bg-white absolute`

    switch (value) {
      case 1:
        dots.push(<div key="center" className={`${dotClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />)
        break
      case 2:
        dots.push(<div key="top-left" className={`${dotClasses} top-[20%] left-[20%]`} />)
        dots.push(<div key="bottom-right" className={`${dotClasses} bottom-[20%] right-[20%]`} />)
        break
      case 3:
        dots.push(<div key="top-left" className={`${dotClasses} top-[20%] left-[20%]`} />)
        dots.push(<div key="center" className={`${dotClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />)
        dots.push(<div key="bottom-right" className={`${dotClasses} bottom-[20%] right-[20%]`} />)
        break
      case 4:
        dots.push(<div key="top-left" className={`${dotClasses} top-[20%] left-[20%]`} />)
        dots.push(<div key="top-right" className={`${dotClasses} top-[20%] right-[20%]`} />)
        dots.push(<div key="bottom-left" className={`${dotClasses} bottom-[20%] left-[20%]`} />)
        dots.push(<div key="bottom-right" className={`${dotClasses} bottom-[20%] right-[20%]`} />)
        break
      case 5:
        dots.push(<div key="top-left" className={`${dotClasses} top-[20%] left-[20%]`} />)
        dots.push(<div key="top-right" className={`${dotClasses} top-[20%] right-[20%]`} />)
        dots.push(<div key="center" className={`${dotClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />)
        dots.push(<div key="bottom-left" className={`${dotClasses} bottom-[20%] left-[20%]`} />)
        dots.push(<div key="bottom-right" className={`${dotClasses} bottom-[20%] right-[20%]`} />)
        break
      case 6:
        dots.push(<div key="top-left" className={`${dotClasses} top-[20%] left-[20%]`} />)
        dots.push(<div key="top-right" className={`${dotClasses} top-[20%] right-[20%]`} />)
        dots.push(<div key="middle-left" className={`${dotClasses} top-1/2 left-[20%] -translate-y-1/2`} />)
        dots.push(<div key="middle-right" className={`${dotClasses} top-1/2 right-[20%] -translate-y-1/2`} />)
        dots.push(<div key="bottom-left" className={`${dotClasses} bottom-[20%] left-[20%]`} />)
        dots.push(<div key="bottom-right" className={`${dotClasses} bottom-[20%] right-[20%]`} />)
        break
      default:
        // Fallback to number display for values outside 1-6
        return (
          <div 
            className="text-white font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ fontSize: config.fontSize }}
          >
            {value}
          </div>
        )
    }

    return dots
  }

  const sizeClasses = {
    small: 'w-10 h-10 rounded-lg border border-gray-800',
    medium: 'w-15 h-15 rounded-xl border-2 border-gray-800', 
    large: 'w-20 h-20 rounded-xl border-2 border-gray-800'
  }

  const shadowClasses = {
    small: disabled ? '' : 'shadow-[2px_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.4)]',
    medium: disabled ? '' : 'shadow-[4px_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4)]',
    large: disabled ? '' : 'shadow-[4px_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4)]'
  }

  const scaleClasses = {
    small: disabled ? '' : 'hover:scale-[1.02]',
    medium: disabled ? '' : 'hover:scale-105',  
    large: disabled ? '' : 'hover:scale-105'
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        relative flex-shrink-0 transition-all duration-200 ease-linear
        ${sizeClasses[size]}
        ${shadowClasses[size]}
        ${scaleClasses[size]}
        ${disabled 
          ? 'opacity-50 cursor-default' 
          : 'cursor-pointer'
        }
      `}
      style={{ 
        backgroundColor: color,
        width: config.width,
        height: config.height
      }}
    >
      {getDots(value)}
    </div>
  )
}

export default DiceComponent
