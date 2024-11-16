import { Line } from 'react-konva'
import { Intersection } from '../state/Intersection'

interface Props {
  intersection: Intersection
  color: string
}

const points = [10, 10, -10, 10, -10, -5, 0, -15, 10, -5]
export function SettlementShape({ intersection, color = '#000000' }: Props) {
  return (
    <Line
      points={points}
      x={intersection.position.x}
      y={intersection.position.y}
      closed={true}
      shadowEnabled={true}
      shadowColor="#000000"
      shadowOffsetX={2}
      shadowBlur={5}
      shadowOpacity={0.6}
      strokeWidth={1.1}
      stroke={'#000000'}
      fill={color}
    />
  )
}
