import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'

export class ClearAvailableEdgesCommand extends Command<MyRoom> {
  execute() {
    this.state.availableEdges = new ArraySchema<string>()
  }
}
