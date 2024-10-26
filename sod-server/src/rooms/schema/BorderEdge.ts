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
}
