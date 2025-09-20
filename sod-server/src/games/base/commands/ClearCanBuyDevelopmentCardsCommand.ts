import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearCanBuyDevelopmentCardsCommand extends Command<MyRoom> {
  execute() {
    this.state.canBuyDevelopmentCards = false
  }
}
