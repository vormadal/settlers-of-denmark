import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

export interface Payload {
  edgeId: string
  playerId: string
}

export class PlaceRoadCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const state = this.room.state

    const cardsToBePayedToBank = [
      ...player.cardsOfType(state, CardVariants.Brick).slice(0,1),
      ...player.cardsOfType(state, CardVariants.Lumber).slice(0,1)
    ]
    
    if(cardsToBePayedToBank.length != 2){
      return
    }

    const availableRoad = player.roads.find((x) => !x.edge)
    if (!availableRoad){
      return
    }
    
    availableRoad.edge = payload.edgeId
    cardsToBePayedToBank.forEach(card => card.owner = null);
  }
}