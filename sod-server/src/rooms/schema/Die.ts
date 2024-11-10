import { Schema, type } from '@colyseus/schema'

export class Die extends Schema {
  @type('string') color: string
  @type('string') type: string
  @type('number') value: number
}
