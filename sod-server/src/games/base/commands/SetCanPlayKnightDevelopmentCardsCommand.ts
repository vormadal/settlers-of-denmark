import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

interface Payload { 
    playerId: string
}
export class SetCanPlayKnightDevelopmentCardsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    this.room.state.canPlayKnightDevelopmentCard = player.numberOfDevelopmentCardsPlayed < 1;
  }
}