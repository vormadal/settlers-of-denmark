import { Line } from 'react-konva'
import { BorderEdge } from '../state/BorderEdge'
import { getCenter, getLineRotation } from '../utils/VectorMath'

interface Props {
  edge: BorderEdge
  color: string
}

const points = [25, 8, 8, 2, -8, 8, -25, 2, -25, -8, -8, -2, 8, -8, 25, -2]
export function RoadShape({ edge, color = '#000000' }: Props) {
  const center = getCenter(edge.pointA, edge.pointB)
  const rotation = getLineRotation(edge.pointA, edge.pointB)
  return (
    <Line
      points={points}
      x={center.x}
      y={center.y}
      closed={true}
      strokeWidth={1}
      stroke={'#000000'}
      fill={color}
      tension={0.5}
      rotation={rotation}
    />
  )
}
