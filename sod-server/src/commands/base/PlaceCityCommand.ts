import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceCityCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const state = this.room.state

    const cardsToBePayedToBank = [
      ...player.cardsOfType(state, CardVariants.Ore).slice(0,3),
      ...player.cardsOfType(state, CardVariants.Grain).slice(0,2)
    ]
    
    if(cardsToBePayedToBank.length != 5){
      return
    }

    const availableCities = player.cities.find((x) => !x.intersection)
    if (!availableCities){
      return
    }
    
    availableCities.intersection = payload.intersectionId
    cardsToBePayedToBank.forEach(card => card.owner = null);
  }
}
