import { Line } from 'react-konva'
import Point from '../geometry/Point'

interface Props {
  position: Point
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

export function CityShape({ position, color = '#000000' }: Readonly<Props>) {
  return (
    <Line
      points={points}
      x={position.x}
      y={position.y}
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
