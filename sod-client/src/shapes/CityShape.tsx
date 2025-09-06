import { Line } from 'react-konva'
import { Intersection } from '../state/Intersection'

interface Props {
  intersection: Intersection
  color: string
}

// Castle-like city shape with multiple towers
const points = [
  // Left tower
  -12, 12,
  -12, -8,
  -8, -12,
  -8, -8,
  // Left wall
  -8, -8,
  -4, -8,
  // Center tower (tallest)
  -4, -8,
  -4, -16,
  0, -20,
  4, -16,
  4, -8,
  // Right wall
  4, -8,
  8, -8,
  // Right tower
  8, -8,
  8, -12,
  12, -8,
  12, 12,
  // Base
  12, 12,
  -12, 12
]

export function CityShape({ intersection, color = '#000000' }: Props) {
  return (
    <Line
      points={points}
      x={intersection.position.x}
      y={intersection.position.y}
      closed={true}
      shadowEnabled={true}
      shadowColor="#000000"
      shadowOffsetX={3}
      shadowBlur={6}
      shadowOpacity={0.7}
      strokeWidth={1.2}
      stroke={'#000000'}
      fill={color}
    />
  )
}
