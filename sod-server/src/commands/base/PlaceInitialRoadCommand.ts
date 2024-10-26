import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { PhaseSteps } from '../../rooms/schema/GameState'

interface Payload {
  edgeId: string
  playerId: string
}
export class PlaceInitialRoadCommand extends Command<MyRoom, Payload> {
  validate(payload: this['payload']): boolean {
    return (
      this.state.phaseStep === PhaseSteps.PlaceInitialRoad &&
      this.state.currentPlayer === payload.playerId &&
      this.state.availableEdges.includes(payload.edgeId)
    )
  }

  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableRoad = player.roads.find((road) => !road.edge)
    availableRoad.edge = payload.edgeId

    this.state.phaseStep = PhaseSteps.PlaceInitialSettlement

    const occupiedIntersections = [...this.state.players.values()]
      .map((x) =>
        x
          .getOccupiedIntersections(this.state)
          .map((intersection) => intersection.getNeighbors(this.state))
          .flat()
      )
      .flat()
      .map((intersection) => intersection.id)

    this.state.availableIntersections.clear()
    this.state.availableIntersections.push(
      ...this.state.intersections
        .filter((intersection) => !occupiedIntersections.includes(intersection.id))
        .map((x) => x.id)
    )
    this.state.nextPlayer() //TODO should this be somewhere else?
  }
}
