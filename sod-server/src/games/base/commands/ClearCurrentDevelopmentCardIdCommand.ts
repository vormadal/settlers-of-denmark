import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearCurrentDevelopmentCardIdCommand extends Command<MyRoom> {
  execute() {
    this.state.currentDevelopmentCardId = null
  }
}