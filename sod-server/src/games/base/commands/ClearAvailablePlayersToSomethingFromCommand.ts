import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearAvailablePlayersToSomethingFromCommand extends Command<MyRoom> {
  execute() {
    this.state.availablePlayersToSomethingFrom = new ArraySchema<string>()
  }
}
