import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

interface Payload { 
    playerId: string
}
export class IncreaseNumberOfDevelopmentCardsPlayedCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    player.numberOfDevelopmentCardsPlayed += 1;
  }
}