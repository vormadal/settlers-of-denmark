import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

interface Payload { 
    playerId: string
}
export class SetCanPlayDevelopmentCardsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    this.room.state.canPlayDevelopmentCards = player.numberOfDevelopmentCardsPlayed < 1;
  }
}