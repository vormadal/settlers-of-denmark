import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { Card, CardNames } from '../../rooms/schema/Card'

interface Payload {
  edgeId: string
  playerId: string
}
export class PlaceRoadCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableRoad = player.roads.find((x) => !x.edge)
    if (availableRoad) {
      availableRoad.edge = payload.edgeId
    }
  }
}

export class PlaceRoadWithPayCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const state = this.room.state

    let cardsToBePayedToBank = []
    cardsToBePayedToBank.push(...player.cardsOfTypeWithAmount(state, CardNames.Brick, 1))
    cardsToBePayedToBank.push(...player.cardsOfTypeWithAmount(state, CardNames.Lumber, 1))
    if(cardsToBePayedToBank.includes(null)){
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