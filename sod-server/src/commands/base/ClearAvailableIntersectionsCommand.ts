import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'

export class ClearAvailableIntersectionsCommand extends Command<MyRoom> {
  execute() {
    this.state.availableIntersections = new ArraySchema<string>()
  }
}
