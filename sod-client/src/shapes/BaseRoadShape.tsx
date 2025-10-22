import React from 'react'
import { Group, Line } from 'react-konva'
import { BorderEdge } from '../state/BorderEdge'
import { getCenter, getLineRotation } from '../geometry/geometryUtils'
import type { Group as GroupType } from 'konva/lib/Group'

interface Props {
  edge: BorderEdge
  borderColor?: string
  fillColor?: string
  roadWidth?: number
  opacity?: number
  onClick?: () => void
  onTouchEnd?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  scale?: number
}

// road dimensions
const roadLength = 55
const roadWidth = 10
const curve = 4

// River-like winding path with symmetric curves
const riverPoints = [
  -roadLength / 2,
  -2, // Start point
  -roadLength / 5,
  -curve, // First curve up
  roadLength / 5,
  curve, // Second curve down (symmetric)
  roadLength / 2,
  2 // End point
]

function RoadLine({ stroke, roadWidth }: { stroke?: string; roadWidth: number }) {
  return (
    <Line
      points={riverPoints}
      stroke={stroke || '#654321'}
      strokeWidth={roadWidth + 4}
      lineCap="round"
      lineJoin="round"
      tension={0.2}
    />
  )
}

export const BaseRoadShape = React.forwardRef<GroupType, Props>(({
  edge,
  borderColor = '#654321',
  fillColor = '#000000',
  roadWidth: customRoadWidth = roadWidth,
  opacity = 1,
  onClick,
  onTouchEnd,
  onMouseEnter,
  onMouseLeave,
  scale = 1
}, ref) => {
  const center = getCenter([edge.pointA, edge.pointB]);
  const rotation = getLineRotation(edge.pointA, edge.pointB);

  return (
    <Group
      ref={ref}
      x={center.x}
      y={center.y}
      rotation={rotation}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      scaleX={scale}
      scaleY={scale}
      opacity={opacity}
    >
      {/* Road border/outline */}
      <RoadLine roadWidth={customRoadWidth} stroke={borderColor} />
      {/* Main road surface */}
      <RoadLine
        roadWidth={customRoadWidth - 4}
        stroke={fillColor}
      />
    </Group>
  )
})