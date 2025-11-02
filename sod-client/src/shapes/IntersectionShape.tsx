import { Group } from 'konva/lib/Group'
import { useRef, useState } from 'react'
import Point from '../geometry/Point'
import { usePulseAnimation } from '../utils/konvaAnimations'
import { BaseSettlementShape } from './BaseSettlementShape'

interface Props {
  position: Point
  show: boolean
  onClick?: () => void
}

export function IntersectionShape({ position, show, onClick }: Props) {
  const [hover, setHover] = useState(false)
  const shapeRef = useRef<Group>(null)

  usePulseAnimation(shapeRef, {
    enabled: show && !hover,
    period: 2000,
    scaleAmplitude: 0.1,
    defaultScale: hover ? 1.2 : 1.0
  })

  function handleMouseEnter() {
    setHover(true)
  }

  function handleMouseLeave() {
    setHover(false)
  }

  if (!show) return null

  return (
    <BaseSettlementShape
      ref={shapeRef}
      x={position.x}
      y={position.y}
      fillColor="#ffffff"
      borderColor="#000000"
      opacity={0.6}
      onClick={onClick}
      onTouchEnd={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scale={1}
    />
  )
}
