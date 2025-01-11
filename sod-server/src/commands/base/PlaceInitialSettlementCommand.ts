import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceInitialSettlementCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(payload.playerId)
    const availableSettlement = player.settlements.find((x) => !x.intersection)

    availableSettlement.intersection = payload.intersectionId
    availableSettlement.round = this.room.state.round
  }
}
