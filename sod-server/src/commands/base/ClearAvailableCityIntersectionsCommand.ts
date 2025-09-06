import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'

export class ClearAvailableCityIntersectionsCommand extends Command<MyRoom> {
  execute() {
    this.state.availableCityIntersections = new ArraySchema<string>()
  }
}
