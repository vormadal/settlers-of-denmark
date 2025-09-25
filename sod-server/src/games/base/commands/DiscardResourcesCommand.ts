import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export interface Payload {
    give: [{
        resourceType: string
        amount: number
    }]
    playerId: string
}

export class DiscardResourcesCommand extends Command<MyRoom, Payload> {
    execute(payload: Payload) {
        const player = this.room.state.players.get(payload.playerId)
        const state = this.room.state

        if (!player || !payload.give ) {
            console.warn('Invalid discard resources command payload or player not found', payload)
            return
        }

        console.log(`Player ${player.id} is discarding resources:`, payload.give)

        for (const give of payload.give) {
            let cardsToReturn = player.cardsOfType(state, give.resourceType)
            cardsToReturn = cardsToReturn.slice(0, give.amount)
            cardsToReturn.forEach(card => card.owner = undefined)
        }
    }
}

