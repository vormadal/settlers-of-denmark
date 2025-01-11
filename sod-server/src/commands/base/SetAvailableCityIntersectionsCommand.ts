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
      player.cardsOfType(this.state, CardVariants.Grain).length > 1 && 
      player.cardsOfType(this.state, CardVariants.Ore).length > 2
    ){
      return
    }

    this.state.availableIntersections = new ArraySchema<string>(
      ...playerSettlements.map(x => x.id)
    )
  }
}
