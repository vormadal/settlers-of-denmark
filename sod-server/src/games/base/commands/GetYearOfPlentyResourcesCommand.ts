import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export interface Payload {
    receive: [{
        resourceType: string
        amount: number
    }]
    playerId: string
}

export class GetYearOfPlentyResourcesCommand extends Command<MyRoom, Payload> {
    execute(payload: Payload) {
        const player = this.room.state.players.get(payload.playerId)
        const state = this.room.state

        let amountToReceive = 0
        for (const receive of payload.receive) {
            const availableCards = state.getAvailableCardsByType(receive.resourceType)
            if (availableCards.length < receive.amount) {
                console.warn('Not enough available cards to receive', payload)
                return
            }
            amountToReceive += receive.amount
        }
        
        for (const receive of payload.receive) {
            let cardsToGive = state.getAvailableCardsByType(receive.resourceType)
            cardsToGive = cardsToGive.slice(0, receive.amount)
            cardsToGive.forEach(card => card.owner = player.id)
        }
    }
}

