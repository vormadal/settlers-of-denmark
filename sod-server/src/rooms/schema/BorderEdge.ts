import { Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { Point } from './Point'

export class BorderEdge extends Schema {
  @type(Point) pointA: Point
  @type(Point) pointB: Point
  @type('string') id: string

  getIntersections(state: GameState) {
    return state.intersections.filter(
      (intersection) => intersection.position.id === this.pointA.id || intersection.position.id === this.pointB.id
    )
  }

  getConnectedEdges(state: GameState) {
    return state.edges.filter((edge) => {
      const myPoints = [this.pointA.id, this.pointB.id]
      return (myPoints.includes(edge.pointA.id) || myPoints.includes(edge.pointB.id)) && edge.id !== this.id
    })
  }
}
