import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

interface Payload {
  playerId: string
}

export class SetAvailablePlayersToStealFromCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(payload.playerId)
    const state = this.state

    const hex = state.hexes.find((h) => h.id === state.robberHex)
    const structures = hex.getStructures(state)
    const playersToStealFrom = new Set<string>(structures.map(s => s.owner).filter((id) => id !== player.id))
    state.availablePlayersToStealFrom = new ArraySchema<string>(...playersToStealFrom)
  }
}
