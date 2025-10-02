import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearHasDiceBeenRolledCommand extends Command<MyRoom> {
  execute() {
    this.state.hasDiceBeenRolled = false
  }
}