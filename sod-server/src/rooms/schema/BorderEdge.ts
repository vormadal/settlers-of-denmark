import { ArraySchema, Schema, type } from '@colyseus/schema'
import { Point } from './Point'
import { GameState } from './GameState'

export class BorderEdge extends Schema {
  @type(Point) pointA: Point
  @type(Point) pointB: Point
  @type('string') id: string
  @type(['string']) neighbors = new ArraySchema<string>()

  getNeighbors(state: GameState) {
    return this.neighbors.map((id) => state.edges.find((edge) => edge.id === id))
  }
}
