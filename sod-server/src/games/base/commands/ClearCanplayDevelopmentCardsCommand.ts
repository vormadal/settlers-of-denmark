import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearCanPlayDevelopmentCardsCommand extends Command<MyRoom> {
  execute() {
    this.room.state.canPlayDevelopmentCards = false;
  }
}
