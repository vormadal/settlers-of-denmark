import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'

interface Payload {
  initialPlacement: boolean
}
export class SetAvailableRoadEdgesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    this.state.availableEdges.clear()
    const player = this.state.players.get(this.state.currentPlayer)

    if (payload.initialPlacement) {
      const structures = player.structures.filter((x) => x.intersection) ?? []
      const settlement = structures.find((x) => x.getRoads(this.state).length === 0)
      this.state.availableEdges.push(...settlement.getEdges(this.state).map((x) => x.id))
      return
    }

    const cards = player.numberOfCards(this.state)
    if (![CardVariants.Brick, CardVariants.Lumber].every((variant) => cards[variant] > 0)) {
      return
    }

    const occupiedEdgeIds = this.state.roads.filter((x) => x.edge).map((x) => x.edge)

    const playerOccupiedEdges = player.roads
      .filter((x) => x.edge)
      .map((x) => this.state.edges.find((edge) => edge.id === x.edge))

    const availableEdges = playerOccupiedEdges
      .map((x) => x.getConnectedEdges(this.state))
      .flat()
      .filter((x) => !occupiedEdgeIds.includes(x.id))

    this.state.availableEdges.push(...availableEdges.map((x) => x.id))
  }
}
