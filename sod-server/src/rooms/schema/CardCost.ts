import { Schema, type } from '@colyseus/schema'

export class CardCost extends Schema {
  @type('string') type: string
  @type('number') cost: number
}
