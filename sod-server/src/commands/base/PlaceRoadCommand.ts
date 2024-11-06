import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { PhaseSteps } from '../../rooms/schema/GameState'

interface Payload {
  edgeId: string
  playerId: string
}
export class PlaceRoadCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableRoad = player.roads.find((road) => !road.edge)
    availableRoad.edge = payload.edgeId
  }
}