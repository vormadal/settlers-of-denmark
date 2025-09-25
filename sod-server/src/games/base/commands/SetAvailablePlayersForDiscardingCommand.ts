import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardTypes } from '../../../rooms/schema/Card'

export class SetAvailablePlayersForDiscardingCommand extends Command<MyRoom> {
  execute() {
    const state = this.state

    const AvailablePlayers = new Set<string>()
    for (const [,player] of state.players) {
        const resourceCards = player.cards(this.room.state).filter(card => card.type === CardTypes.Resource);
        if (resourceCards.length > 7) {
            AvailablePlayers.add(player.id);
        }
    }

    state.availablePlayersToSomethingFrom = new ArraySchema<string>(...AvailablePlayers)

    console.log(`Set availablePlayersToSomethingFrom to [${[...state.availablePlayersToSomethingFrom].join(', ')}]`)
  }
}
