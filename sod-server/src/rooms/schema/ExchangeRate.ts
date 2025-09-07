import { ArraySchema, Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { BorderEdge } from './BorderEdge'

export class ExchangeRate extends Schema {
  @type('string') resourceType: string
  @type('number') ratio: number

  static create(resourceType: string, ratio: number) {
    return new ExchangeRate().assign({
      resourceType,
      ratio
    })
  }
}
