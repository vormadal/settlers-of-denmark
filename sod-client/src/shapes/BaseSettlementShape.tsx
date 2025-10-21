import React from 'react'
import { Group, Line } from 'react-konva'
import { Intersection } from '../state/Intersection'
import type { Group as GroupType } from 'konva/lib/Group'

interface Props {
  intersection: Intersection
  borderColor?: string
  fillColor?: string
  opacity?: number
  onClick?: () => void
  onTouchEnd?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  scale?: number
}

// Settlement house shape points
const points = [10, 10, -10, 10, -10, -5, 0, -15, 10, -5]

export const BaseSettlementShape = React.forwardRef<GroupType, Props>(({
  intersection,
  borderColor = '#000000',
  fillColor = '#ffffff',
  opacity = 1,
  onClick,
  onTouchEnd,
  onMouseEnter,
  onMouseLeave,
  scale = 1
}, ref) => {
  return (
    <Group
      ref={ref}
      x={intersection.position.x}
      y={intersection.position.y}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      scaleX={scale}
      scaleY={scale}
      opacity={opacity}
    >
      <Line
        points={points}
        closed={true}
        shadowEnabled={true}
        shadowColor="#000000"
        shadowOffsetX={2}
        shadowBlur={5}
        shadowOpacity={0.6}
        strokeWidth={1.1}
        stroke={borderColor}
        fill={fillColor}
      />
    </Group>
  )
})