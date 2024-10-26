import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { PhaseSteps } from '../../rooms/schema/GameState'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceHouseCommand extends Command<MyRoom, Payload> {
  // validate(payload: this['payload']): boolean {
  //   return (
  //     this.state.phaseStep === PhaseSteps.PlaceInitialSettlement &&
  //     this.state.currentPlayer === payload.playerId &&
  //     this.state.availableIntersections.includes(payload.intersectionId)
  //   )
  // }
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableHouse = player.houses.find((house) => !house.intersection)
    availableHouse.intersection = payload.intersectionId
  }
}
