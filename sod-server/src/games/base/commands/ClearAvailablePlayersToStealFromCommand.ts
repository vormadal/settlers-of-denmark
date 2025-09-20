import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearAvailablePlayersToStealFromCommand extends Command<MyRoom> {
  execute() {
    this.state.availablePlayersToStealFrom = new ArraySchema<string>()
  }
}
