import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

interface Payload { 
    playerId: string, 
    resourceVariant: string 
}

export class MonopolizeResourceCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const resourceName = payload.resourceVariant;
    const allPlayers = Array.from(this.room.state.players.values());
    const currentPlayer = this.room.state.players.get(payload.playerId);

    for(const player of allPlayers) {
      if (player.id !== currentPlayer.id) {
        const cardsToSteal = player.cardsOfType(this.room.state, resourceName);
        if (cardsToSteal.length > 0) {
          for (const card of cardsToSteal) {
            card.owner = currentPlayer.id;
          }
        }
      }
    }

    console.log(`Player ${currentPlayer.id} has monopolized all ${resourceName} cards.`);
  }
}
