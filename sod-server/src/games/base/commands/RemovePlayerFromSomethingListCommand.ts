import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'

interface Payload {
  playerId: string
}

export class RemovePlayerFromSomethingListCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {

    console.log(`Removing player ${payload.playerId} from availablePlayersToSomethingFrom list.`)

    this.state.availablePlayersToSomethingFrom = new ArraySchema<string>(
      ...this.state.availablePlayersToSomethingFrom.filter(id => id !== payload.playerId)
    )
  }
}
