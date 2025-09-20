import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'

interface Payload { 
    playerId: string, 
    cardId: string 
}
export class PlayKnightDevelopmentCardCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId)
    const state = this.room.state
    const card = state.deck.find(c => c.id === payload.cardId && c.owner === player.id && c.variant === CardVariants.Knight);
    console.log('Player', player.id, 'is playing a Knight development card')
    if (!card){
        console.log('Card not found:', payload.cardId);
        return;
    }

    player.knightsPlayed += 1;
    card.playedBy = player.id;
    card.owner = undefined;
  }
}