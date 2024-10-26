import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export class NextPlayerCommand extends Command<MyRoom> {
  execute() {
    const playerIds = [...this.room.state.players.keys()]
    const currentPlayerIndex = playerIds.indexOf(this.room.state.currentPlayer)

    this.state.currentPlayer =
      currentPlayerIndex < 0 ? playerIds[0] : playerIds[(currentPlayerIndex + 1) % playerIds.length]
  }
}
