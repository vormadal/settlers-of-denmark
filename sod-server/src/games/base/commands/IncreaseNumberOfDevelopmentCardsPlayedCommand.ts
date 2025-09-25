import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card';

interface Payload { 
    playerId: string
    cardId: string
}
export class IncreaseNumberOfDevelopmentCardsPlayedCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const card = this.room.state.deck.find(
      (card) => card.id === payload.cardId
    );
    const player = this.room.state.players.get(payload.playerId)

    if (card.variant !== CardVariants.VictoryPoint) {
      player.numberOfDevelopmentCardsPlayed += 1;
      this.room.state.currentDevelopmentCardId = card.id;
    }
  }
}