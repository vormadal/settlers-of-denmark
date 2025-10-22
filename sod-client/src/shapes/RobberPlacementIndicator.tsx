import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'
import { Circle } from 'react-konva'
import { Hex } from '../state/Hex'
import { getCenter } from '../geometry/geometryUtils'

interface Props {
  hex: Hex
  onClick: (hexId: string) => void
}

export function RobberPlacementIndicator({ hex, onClick }: Props) {
  const [focus, setFocus] = useState(false)

  function handleClick() {
    onClick(hex.id)
  }

  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true)
    document.body.style.cursor = 'pointer'
  }

  function handleMouseLeave() {
    setFocus(false)
    document.body.style.cursor = 'default'
  }

  // Position the placement indicator where the robber will be placed
  // Same offset as the robber but slightly more prominent
  const robberOffsetX = 30 // Slightly more off-center than current robber
  const robberOffsetY = -15 // Slightly higher than current robber

  const center = getCenter(hex.intersections.map(x => x.position))
  return (
    <Circle
      x={center.x + robberOffsetX}
      y={center.y + robberOffsetY}
      radius={12}
      fill="#666666"
      onClick={handleClick}
      onTouchEnd={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scaleX={focus ? 1.4 : 1}
      scaleY={focus ? 1.4 : 1}
      opacity={0.7}
      shadowEnabled={true}
      shadowColor="#000000"
      shadowOffsetX={2}
      shadowBlur={3}
      shadowOpacity={0.4}
      strokeWidth={2}
      stroke="#333333"
    />
  )
}