import { Schema, type } from '@colyseus/schema'

export const DieTypes = {
  Regular: 'regular',
  Event: 'event'
}

export class Die extends Schema {
  @type('string') color: string
  @type('string') type: string
  @type('number') value: number

  static createRegular(color: string) {
    return new Die().assign({ color, type: DieTypes.Regular, value: 6 })
  }

  static createEvent(color: string) {
    // maybe value should be of type string to allow for more complex events
    return new Die().assign({ color, type: DieTypes.Event, value: 0 })
  }
}
