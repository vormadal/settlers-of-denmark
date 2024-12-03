import { Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'

export class Road extends Schema {
  @type('string') id: string
  @type('string') owner: string
  @type('string') edge: string

  static create(id: string, owner: string) {
    return new Road().assign({
      id,
      owner
    })
  }

  getEdge(state: GameState) {
    return state.edges.find((edge) => edge.id === this.edge)
  }
}
