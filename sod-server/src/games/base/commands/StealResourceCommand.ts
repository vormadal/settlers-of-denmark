import { Command } from "@colyseus/command";
import { MyRoom } from "../../../rooms/MyRoom";
import { CardTypes } from "../../../rooms/schema/Card";

interface Payload {
  playerId: string;
  victimId: string;
}

export class StealResourceCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(payload.playerId);
    const victim = this.state.players.get(payload.victimId);
    const state = this.state;

    if (!player || !victim) {
      console.warn('StealResourceCommand: Invalid playerId or victimId');
      return;
    }

    const cards = state.deck.filter((card) => card.owner === victim.id && card.type === CardTypes.Resource);
    if (cards.length === 0) {
      console.warn('StealResourceCommand: Victim has no resources to steal');
      return;
    }

    if(cards.length === 1){
        const card = cards[0];
        card.owner = player.id;
        return;
    }

    const randomIndex = Math.floor(Math.random() * cards.length);
    const card = cards[randomIndex];
    card.owner = player.id;
  }
}
