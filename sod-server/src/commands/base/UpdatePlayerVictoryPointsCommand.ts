import { Command } from "@colyseus/command";
import { MyRoom } from "../../rooms/MyRoom";
import { CardVariants } from "../../rooms/schema/Card";

export interface Payload {
  playerId: string;
}

export class UpdatePlayerVictoryPointsCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(payload.playerId);
    const state = this.state;

    const settlementVP = player.getPlacedSettlements().length;
    const cityVP = player.getPlacedCities().length * 2;

    const longestRoadVP = state.hasLongestRoad === player.id ? 2 : 0;
    const largestArmyVP = player.hasLargestArmy ? 2 : 0;

    const devCardVP = player.cardsOfType(
      state,
      CardVariants.VictoryPoint
    ).length;

    player.victoryPoints = settlementVP + cityVP + longestRoadVP + largestArmyVP + devCardVP;
  }
}
