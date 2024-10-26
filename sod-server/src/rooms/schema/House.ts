import { Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'

export class House extends Schema {
  @type('string') id: string
  @type('string') owner: string
  @type('string') intersection?: string

  getIntersection(state: GameState) {
    return state.intersections.find((x) => x.id === this.intersection)
  }
}
