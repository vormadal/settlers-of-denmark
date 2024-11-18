import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  edgeId: string
  playerId: string
}
export class PlaceRoadCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const availableRoad = player.roads.find((x) => !x.edge)
    if (availableRoad) {
      availableRoad.edge = payload.edgeId
    }
  }
}
