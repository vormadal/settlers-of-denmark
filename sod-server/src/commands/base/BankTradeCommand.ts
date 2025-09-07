import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export interface Payload {
	give: [{
		resourceType: string
		amount: number
	}]
	receive: [{
		resourceType: string
		amount: number
	}]
	playerId: string
}

export class BankTradeCommand extends Command<MyRoom, Payload> {
	execute(payload: Payload) {
		const player = this.room.state.players.get(payload.playerId)
		const state = this.room.state

		if (!player || !payload.give || !payload.receive) {
			console.warn('Invalid bank trade command payload or player not found', payload)
			return
		}

		let buyingPower = 0
		for (const give of payload.give) {
			const bankRate = player.exchangeRate.get(give.type).ratio
			const playerCardsOfType = player.cardsOfType(state, give.type)

			if (give.amount % bankRate !== 0 || playerCardsOfType.length < give.amount) {
				console.warn('Invalid give count or not enough cards to give', payload)
				return
			}

			buyingPower += give.amount / bankRate
		}

		let amountToReceive = 0
		for (const receive of payload.receive) {
            const availableCards = state.getAvailableCardsByType(receive.resourceType)
			if (availableCards.length < receive.amount) {
				console.warn('Not enough available cards to receive', payload)
				return
			}
			amountToReceive += receive.amount
		}
        
		if (amountToReceive !== buyingPower) {
			console.warn('Buying power does not match amount to receive', { buyingPower, amountToReceive })
			return
		}
		
		for (const give of payload.give) {
			let cardsToReturn = player.cardsOfType(state, give.resourceType)
			cardsToReturn = cardsToReturn.slice(0, give.amount)
			cardsToReturn.forEach(card => card.owner = undefined)
		}

		for (const receive of payload.receive) {
			let cardsToGive = state.getAvailableCardsByType(receive.resourceType)
			cardsToGive = cardsToGive.slice(0, receive.amount)
			cardsToGive.forEach(card => card.owner = player.id)
		}
	}
}

