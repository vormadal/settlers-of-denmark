import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
interface Payload {
  initialPlacement: boolean
}
export class SetAvailableHouseIntersectionsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const occupiedIntersections = [...this.state.players.values()]
      .map((x) =>
        x
          .getOccupiedIntersections(this.state)
          .map((intersection) => intersection.getNeighbors(this.state))
          .flat()
      )
      .flat()
      .map((intersection) => intersection.id)

    this.state.availableIntersections.push(
      ...this.state.intersections
        .filter((intersection) => !occupiedIntersections.includes(intersection.id))
        .map((x) => x.id)
    )
  }
}
