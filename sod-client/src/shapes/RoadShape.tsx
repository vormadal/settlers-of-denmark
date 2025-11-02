import Point from '../geometry/Point'
import { BaseRoadShape } from './BaseRoadShape'

interface Props {
  pointA: Point
  pointB: Point
  color: string
}

export function RoadShape({ pointA, pointB, color = '#000000' }: Props) {
  return (
    <BaseRoadShape
      pointA={pointA}
      pointB={pointB}
      fillColor={color}
    />
  )
}
