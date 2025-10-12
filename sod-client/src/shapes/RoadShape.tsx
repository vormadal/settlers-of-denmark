import { Group, Line } from 'react-konva'
import { BorderEdge } from '../state/BorderEdge'
import { getCenter, getLineRotation } from '../utils/VectorMath'

interface Props {
  edge: BorderEdge
  color: string
}

export function RoadShape({ edge, color = '#000000' }: Props) {
  const center = getCenter(edge.pointA, edge.pointB)

  // Calculate the base rotation
  const rotation = getLineRotation(edge.pointA, edge.pointB)

  return (
    <Group
      x={center.x}
      y={center.y}
      rotation={rotation}
    >
      {/* Road border/outline */}
      <RoadLine roadWidth={roadWidth} />
      {/* Main road surface */}
      <RoadLine
        roadWidth={roadWidth - 4}
        stroke={color}
      />
    </Group>
  )
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
