import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'
interface Payload {
  initialPlacement: boolean
}
export class SetCanBuyDevelopmentCardsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(this.state.currentPlayer)
    
    if (payload.initialPlacement) {
      return
    }

    if(
      player.cardsOfType(this.state, CardVariants.Wool).length < 1 || 
      player.cardsOfType(this.state, CardVariants.Grain).length < 1 || 
      player.cardsOfType(this.state, CardVariants.Ore).length < 1
    ){
      return
    }

    this.state.canBuyDevelopmentCards = true
  }
}
