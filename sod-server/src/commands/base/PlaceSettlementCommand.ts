import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceSettlementCommand extends Command<MyRoom, Payload> {
  // validate(payload: this['payload']): boolean {
  //   return (
  //     this.state.phaseStep === PhaseSteps.PlaceInitialSettlement &&
  //     this.state.currentPlayer === payload.playerId &&
  //     this.state.availableIntersections.includes(payload.intersectionId)
  //   )
  // }
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableHouse = player.settlements.find((settlement) => !settlement.intersection)
    availableHouse.intersection = payload.intersectionId
  }
}
