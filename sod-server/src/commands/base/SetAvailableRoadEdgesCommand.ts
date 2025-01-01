import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'

interface Payload {
  initialPlacement: boolean
}
export class SetAvailableEdgesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(this.state.currentPlayer)

    if (payload.initialPlacement) {
      const structures = player.structures.filter((x) => x.intersection) ?? []
      const settlement = structures.find((x) => x.getRoads(this.state).length === 0)
      this.state.availableEdges = new ArraySchema(...settlement.getEdges(this.state).map((x) => x.id))
      return
    }

    if (
      ![CardVariants.Brick, CardVariants.Lumber].every((variant) => player.cardsOfType(this.state, variant).length > 0)
    ) {
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

    this.state.availableEdges = new ArraySchema<string>(...availableEdges.map((x) => x.id))
  }
}
