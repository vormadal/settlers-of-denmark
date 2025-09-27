import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

export class ClearCanPlayKnightDevelopmentCardsCommand extends Command<MyRoom> {
  execute() {
    this.room.state.canPlayKnightDevelopmentCard = false;
  }
}