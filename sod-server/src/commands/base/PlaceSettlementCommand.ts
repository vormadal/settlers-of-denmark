import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceSettlementCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const state = this.room.state

    const cardsToBePayedToBank = [
      ...player.cardsOfType(state, CardVariants.Brick).slice(0,1),
      ...player.cardsOfType(state, CardVariants.Lumber).slice(0,1),
      ...player.cardsOfType(state, CardVariants.Grain).slice(0,1),
      ...player.cardsOfType(state, CardVariants.Wool).slice(0,1),
    ]
    
    if(cardsToBePayedToBank.length != 4){
      return
    }

    const availableSettlement = player.settlements.find((x) => !x.intersection)
    if (!availableSettlement){
      return
    }
    
    availableSettlement.intersection = payload.intersectionId
    cardsToBePayedToBank.forEach(card => card.owner = null);
  }
}
