import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export interface Payload {
	give: [{
		type: string
		count: number
	}]
	receive: [{
		type: string
		count: number
	}]
	playerId: string
}

export class BankTradeCommand extends Command<MyRoom, Payload> {
	execute(payload: Payload) {
		const player = this.room.state.players.get(payload.playerId)
		const state = this.room.state

		if (!player || !payload.give || !payload.receive) {
			return
		}

		let buyingPower = 0
		for (const give of payload.give) {
			const bankRate = player.exchangeRate.get(give.type).ratio
			const playerCardsOfType = player.cardsOfType(state, give.type)

			if (give.count % bankRate !== 0 || playerCardsOfType.length < give.count) {
				return
			}

			buyingPower += give.count / bankRate
		}

		let amountToReceive = 0
		for (const receive of payload.receive) {
            const availableCards = state.getAvailableCardsByType(receive.type)
			if (availableCards.length < receive.count) {
				return
			}
			amountToReceive += receive.count
		}
        
		if (amountToReceive !== buyingPower) {
			return
		}
        
		for (const give of payload.give) {
			let cardsToReturn = player.cardsOfType(state, give.type)
			cardsToReturn = cardsToReturn.slice(0, give.count)
			cardsToReturn.forEach(card => card.owner = undefined)
		}

		for (const receive of payload.receive) {
			let cardsToGive = state.getAvailableCardsByType(receive.type)
			cardsToGive = cardsToGive.slice(0, receive.count)
			cardsToGive.forEach(card => card.owner = player.id)
		}
	}
}

