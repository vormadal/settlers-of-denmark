import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { GamePhases, PhaseSteps } from '../../rooms/schema/GameState'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceHouseCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableHouse = player.houses.find((house) => !house.intersection)
    availableHouse.intersection = payload.intersectionId

    if (this.state.phase === GamePhases.Establishment) {
      this.state.phaseStep = PhaseSteps.PlaceInitialRoad
    }
  }
}
