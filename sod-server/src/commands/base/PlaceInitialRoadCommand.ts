import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { Payload } from './PlaceRoadCommand'

export class PlaceInitialRoadCommand extends Command<MyRoom, Payload> {
    execute(payload: Payload) {
      const player = this.room.state.players.get(payload.playerId)
      const availableRoad = player.roads.find((x) => !x.edge)
      if (availableRoad) {
        availableRoad.edge = payload.edgeId
      }
    }
  }