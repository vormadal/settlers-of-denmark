import { Line } from 'react-konva'
import { Intersection } from '../state/Intersection'

interface Props {
  intersection: Intersection
  color: string
}

// Simple building shape matching the city icon design
const points = [
  // Start from bottom right and go clockwise
  14, 14,   // bottom right
  -14, 14,  // bottom left
  -14, -14, // top left
  -4, -14,  // notch start left
  -4, -4,   // notch inner left
  4, -4,    // notch inner right
  4, -14,   // notch end right
  14, -14,  // top right
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
      shadowOffsetX={1}
      shadowOffsetY={1}
      shadowBlur={2}
      shadowOpacity={0.3}
      strokeWidth={1.2}
      stroke={'#000000'}
      fill={color}
    />
  )
}
