import { Line } from 'react-konva'
import { Intersection } from '../state/Intersection'

interface Props {
  intersection: Intersection
  color: string
}

const points = [10, 10, -10, 10, -10, -10, -3, -10, -3, -3, 3, -3, 3, -10, 10, -10, 10, 10]

export function CityShape({ intersection, color = '#000000' }: Props) {
  return (
    <Line
      points={points}
      x={intersection.position.x}
      y={intersection.position.y}
      closed={true}
      strokeWidth={0.01}
      stroke={'#000000'}
      fill={color}
    />
  )
}
