import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { PhaseSteps } from '../../rooms/schema/GameState'

interface Payload {
  intersectionId: string
  playerId: string
}
export class PlaceInitialHouseCommand extends Command<MyRoom, Payload> {
  validate(payload: this['payload']): boolean {
    return (
      this.state.phaseStep === PhaseSteps.PlaceInitialSettlement &&
      this.state.currentPlayer === payload.playerId &&
      this.state.availableIntersections.includes(payload.intersectionId)
    )
  }
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const intersection = this.room.state.intersections.find((x) => x.id === payload.intersectionId)
    const availableHouse = player.houses.find((house) => !house.intersection)
    availableHouse.intersection = payload.intersectionId
    this.state.phaseStep = PhaseSteps.PlaceInitialRoad
    this.state.availableEdges.clear()
    const availableEdges = intersection.getEdges(this.state)
    this.state.availableEdges.push(...availableEdges.map((x) => x.id))
  }
}
