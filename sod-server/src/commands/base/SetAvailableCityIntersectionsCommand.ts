import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'
interface Payload {
  initialPlacement: boolean
}
export class SetAvailableCityIntersectionsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(this.state.currentPlayer)
    const playerSettlements = player.settlements

    if (payload.initialPlacement) {
      return
    }

    if(
      player.cardsOfType(this.state, CardVariants.Grain).length < 2 || 
      player.cardsOfType(this.state, CardVariants.Ore).length < 3
    ){
      return
    }

    this.state.availableCityIntersections = new ArraySchema<string>(
      ...playerSettlements.map(x => x.intersection)
    )
  }
}
