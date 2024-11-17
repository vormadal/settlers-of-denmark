import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  playerId: string
}
export class ProduceInitialResourcesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    // get settlement placed in second round
    const settlement = player.settlements.find((settlement) => settlement.intersection && settlement.round === 2)

    if (!settlement) {
      return
    }

    // get hexes surrounding the settlement
    const hexes = settlement.getIntersection(this.room.state)?.GetSurroundingHexes(this.room.state) || []
    for (const hex of hexes) {
      // find out what resources the hex produces for a settlement
      const production = this.room.state.hexProductions.find(
        (x) => x.hexType === hex.type && x.structureType === 'settlement'
      )
      if (production) {
        // these are the produced resources
        for (const resource of production.getResources(this.room.state)) {
          const index = this.room.state.deck.indexOf(resource)
          // remove the card from the deck
          const cards = this.state.deck.slice(index, index + 1)
          for (const card of cards) {
            // owner might be redundant as the object is moved from the deck to the player
            card.owner = payload.playerId
            // add the card to the players hand
            player.cards.push(card)
          }
        }
      }
    }
  }
}
