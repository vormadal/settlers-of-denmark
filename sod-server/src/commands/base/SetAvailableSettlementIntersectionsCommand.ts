import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'
interface Payload {
  initialPlacement: boolean
}
export class SetAvailableSettlementIntersectionsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(this.state.currentPlayer)
    if (!payload.initialPlacement) {
      const cards = player.cards(this.state)
      if (
        ![CardVariants.Brick, CardVariants.Grain, CardVariants.Lumber, CardVariants.Wool].every(
          (variant) => cards[variant] > 0
        )
      ) {
        return
      }
    }

    const occupiedIntersections = this.state.getOccupiedIntersections()
    const neighbours = occupiedIntersections.map((intersection) => intersection.getNeighbors(this.state)).flat()
    const unavailableIntersections = [...new Set([...occupiedIntersections, ...neighbours])].map((x) => x.id)

    let intersections = this.state.intersections.toArray()

    if (!payload.initialPlacement) {
      // get intersections connected to any of the player roads
      intersections = player.roads
        .filter((x) => x.edge)
        .map((x) => x.getEdge(this.state).getIntersections(this.state))
        .flat()
    }

    this.state.availableIntersections = new ArraySchema<string>(
      ...intersections.filter((intersection) => !unavailableIntersections.includes(intersection.id)).map((x) => x.id)
    )
  }
}
