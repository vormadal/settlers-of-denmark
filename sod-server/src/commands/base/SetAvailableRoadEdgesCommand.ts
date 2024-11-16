import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  initialPlacement: boolean
}
export class SetAvailableRoadEdgesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const settlements = this.state.players.get(this.state.currentPlayer).settlements.filter((x) => x.intersection) ?? []

    const edges = payload.initialPlacement
      ? settlements
          .filter((x) => x.intersection)
          .find((x) => x.getRoads(this.state).length === 0)
          ?.getIntersection(this.state)
          ?.getEdges(this.state) ?? []
      : settlements.map((x) => x.getIntersection(this.state).getEdges(this.state)).flat()

    //TODO check if any edge is already occupied by another players road
    this.state.availableEdges.push(...edges.map((x) => x.id))
  }
}
