import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export class ClearAvailableEdgesCommand extends Command<MyRoom> {
  execute() {
    this.state.availableEdges.clear()
  }
}
