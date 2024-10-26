import { Schema, type } from '@colyseus/schema'
import { Point } from './Point'
import { GameState } from './GameState'

export class Intersection extends Schema {
  @type(Point) position: Point
  @type('string') id: string

  getNeighbors(state: GameState) {
    const edges = this.getEdges(state)
    return edges
      .map((edge) => {
        return edge.getIntersections(state).filter((intersection) => intersection.id !== this.id)
      })
      .flat()
  }

  getEdges(state: GameState) {
    return state.edges.filter((edge) => edge.pointA.id === this.position.id || edge.pointB.id === this.position.id)
  }
}
