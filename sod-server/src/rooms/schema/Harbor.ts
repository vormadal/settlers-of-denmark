import { ArraySchema, Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { BorderEdge } from './BorderEdge'

export class Harbor extends Schema {
  @type(BorderEdge) edge: BorderEdge
  @type('string') id: string
  @type(['string']) cardTypes = new ArraySchema<string>()
  @type('number') ratio: number

  getIntersections(state: GameState) {
    return this.edge.getIntersections(state)
  }

}
