import { BaseRoadShape } from './BaseRoadShape'
import { BorderEdge } from '../state/BorderEdge'

interface Props {
  edge: BorderEdge
  color: string
}

export function RoadShape({ edge, color = '#000000' }: Props) {
  return (
    <BaseRoadShape 
      edge={edge}
      fillColor={color}
    />
  )
}
