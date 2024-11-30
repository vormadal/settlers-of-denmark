import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { CardVariants } from '../../rooms/schema/Card'
interface Payload {
  initialPlacement: boolean
}
export class SetAvailableSettlementIntersectionsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    this.state.availableIntersections.clear();
    if (!payload.initialPlacement) {
      const player = this.state.players.get(this.state.currentPlayer)
      const cards = player.numberOfCards(this.state)
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

    this.state.availableIntersections.push(
      ...this.state.intersections
        .filter((intersection) => !unavailableIntersections.includes(intersection.id))
        .map((x) => x.id)
    )
  }
}
