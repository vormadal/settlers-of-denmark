import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

interface Payload {
  playerId: string
}
export class ProduceInitialResourcesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    // get settlement placed in second round
    const structure = player.structures.find((x) => x.intersection && x.round === 2)

    if (!structure) {
      return
    }

    // get hexes surrounding the settlement
    const hexes = structure.getIntersection(this.room.state)?.GetSurroundingHexes(this.room.state) || []
    for (const hex of hexes) {
      // find out what resources the hex produces for a settlement
      const production = this.room.state.hexProductions.find(
        (x) => x.hexType === hex.type && x.structureType === structure.type
      )
      if (production) {
        // these are the produced resources
        for (const resource of production.getResources(this.room.state)) {
          resource.owner = payload.playerId
        }
      }
    }
  }
}
