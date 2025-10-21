import { useRef, useState } from 'react'
import { Group } from 'konva/lib/Group'
import { Intersection } from '../state/Intersection'
import { BaseSettlementShape } from './BaseSettlementShape'
import { usePulseAnimation } from '../utils/konvaAnimations'

interface Props {
  intersection: Intersection
  show: boolean
  onClick?: () => void
}

export function IntersectionShape({ intersection, show, onClick }: Props) {
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
      intersection={intersection}
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
