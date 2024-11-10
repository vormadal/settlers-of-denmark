import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
interface Payload {
  initialPlacement: boolean
}
export class SetAvailableSettlementIntersectionsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const players = [...this.state.players.values()]
    const occupiedIntersections = players.map((x) => x.getOccupiedIntersections(this.state).flat()).flat()
    const neighbours = occupiedIntersections.map((intersection) => intersection.getNeighbors(this.state)).flat()
    const unavailableIntersections = [...new Set([...occupiedIntersections, ...neighbours])].map((x) => x.id)

    this.state.availableIntersections.push(
      ...this.state.intersections
        .filter((intersection) => !unavailableIntersections.includes(intersection.id))
        .map((x) => x.id)
    )
  }
}
