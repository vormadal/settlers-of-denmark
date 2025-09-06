import { ArraySchema, Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { BorderEdge } from './BorderEdge'

export class TradeRatio extends Schema {
  @type('string') resourceType: string
  @type('number') ratio: number
}
