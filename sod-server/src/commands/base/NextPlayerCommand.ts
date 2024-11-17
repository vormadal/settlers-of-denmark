import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export class NextPlayerCommand extends Command<MyRoom> {
  execute() {
    const playerIds = [...this.state.players.keys()]
    const currentPlayerIndex = playerIds.indexOf(this.state.currentPlayer)

    // last player in the first round starts the second round
    if (currentPlayerIndex === playerIds.length - 1 && this.state.round === 1) {
      this.state.round = 2
      return
    }
    // last player in the second round starts the third round
    if (currentPlayerIndex === 0 && this.state.round === 2) {
      this.state.round = 3
      return // current player stays the same
    }

    // second round goes in reverse order
    if (this.state.round === 2) {
      this.state.currentPlayer = playerIds[currentPlayerIndex - 1]
      return
    }

    // normal round
    let nextPlayerIndex = currentPlayerIndex + 1
    if (nextPlayerIndex >= playerIds.length) {
      this.state.round++
      nextPlayerIndex = 0
    }

    this.state.currentPlayer = playerIds[nextPlayerIndex]
  }
}
