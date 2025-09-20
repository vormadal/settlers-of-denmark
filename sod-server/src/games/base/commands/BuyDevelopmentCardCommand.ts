import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardTypes, CardVariants } from '../../../rooms/schema/Card'

export interface Payload {
  playerId: string
}

export class BuyDevelopmentCardCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const state = this.room.state

    console.log('Player', player.id, 'is buying a development card')

    const cardsToBePayedToBank = [
      ...player.cardsOfType(state, CardVariants.Wool).slice(0,1),
      ...player.cardsOfType(state, CardVariants.Grain).slice(0,1),
        ...player.cardsOfType(state, CardVariants.Ore).slice(0,1)
    ]
    
    if(cardsToBePayedToBank.length != 3){
      console.log('Player', player.id, 'does not have enough cards to buy a development card')
      return
    }

    const availableDevelopmentCard = state.deck.filter((x) => x.type === CardTypes.Development && !x.owner)
    if (!availableDevelopmentCard.length){
      console.log('No development cards left in the deck')
      return
    }

    const developmentCard = availableDevelopmentCard[Math.floor(Math.random() * availableDevelopmentCard.length)]

    if (!developmentCard){
      console.log('No development cards available to draw')
      return
    }

    console.log('Development card drawn:', developmentCard.variant)
    cardsToBePayedToBank.forEach(card => card.owner = null);
    developmentCard.owner = player.id
    developmentCard.boughtInTurn = state.round
  }
}