import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'

export class GameEndedCommand extends Command<MyRoom> {
  execute() {
    console.log("Game Ended")
    this.state.isGameEnded = true
  }
}
