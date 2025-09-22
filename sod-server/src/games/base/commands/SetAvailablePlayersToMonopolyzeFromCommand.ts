import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

interface Payload {
  playerId: string
}

export class SetAvailablePlayersToMonopolyzeFromCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const state = this.state

    const playersToMonopolizeFrom = new Set<string>()
    for (const player of state.players) {
        if (player[0] !== payload.playerId) {
            playersToMonopolizeFrom.add(player[0])
            console.log('Player', player[0], 'can be monopolized from');
        }
    }

    state.availablePlayersToSomethingFrom = new ArraySchema<string>(...playersToMonopolizeFrom)
  }
}
