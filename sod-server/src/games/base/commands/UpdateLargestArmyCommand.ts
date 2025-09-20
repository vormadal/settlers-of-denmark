import { Command } from "@colyseus/command";
import { MyRoom } from "../../../rooms/MyRoom";
import { CardVariants } from "../../../rooms/schema/Card";

export interface Payload {
  playerId: string;
}

export class UpdateLargestArmyCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(payload.playerId);
    const state = this.state;

    const allPlayers = Array.from(state.players.values());

    let playerIdWithLargestArmy = state.hasLargestArmy;
    let maxKnights = allPlayers.find(p => p.id === playerIdWithLargestArmy)?.knightsPlayed || 0;

    for(const p of allPlayers){
        if(p.knightsPlayed > maxKnights){
            maxKnights = p.knightsPlayed;
            playerIdWithLargestArmy = p.id;
        }
    }

    if(maxKnights > 2){
        state.hasLargestArmy = playerIdWithLargestArmy;
    }
  }
}
