import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export class ClearAvailableIntersectionsCommand extends Command<MyRoom> {
  execute() {
    this.state.availableIntersections.clear()
  }
}
