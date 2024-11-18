import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  initialPlacement: boolean
}
export class SetAvailableRoadEdgesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(this.state.currentPlayer)
    const structures = player.structures.filter((x) => x.intersection) ?? []
    if (payload.initialPlacement) {
      const settlement = structures.find((x) => x.getRoads(this.state).length === 0)
      this.state.availableEdges.push(...settlement.getEdges(this.state).map((x) => x.id))
      return
    }

    const playerOccupiedEdges = player.roads
      .filter((x) => x.edge)
      .map((x) => this.state.edges.find((edge) => edge.id === x.edge))

    const totalOccupiedEdgeIds = this.state.roads.filter((x) => x.edge).map((x) => x.edge)

    const availableEdges = playerOccupiedEdges
      .map((x) => x.getConnectedEdges(this.state))
      .flat()
      .filter((x) => !totalOccupiedEdgeIds.includes(x.id))

    this.state.availableEdges.push(...availableEdges.map((x) => x.id))
  }
}
