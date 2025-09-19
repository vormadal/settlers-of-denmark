import { Command } from "@colyseus/command";
import { MyRoom } from "../../rooms/MyRoom";
import { calculateLongestRoad, setLongestRoad } from "./UpdatePlayerLongestRoadCommand";

interface Payload {
  intersectionId: string;
  playerId: string;
}
export class UpdateLongestRoadAfterSettlementPlacementCommand extends Command<
  MyRoom,
  Payload
> {
  execute(payload: Payload) {
    const player = this.room.state.players.get(payload.playerId);
    const state = this.room.state;

    const affectedOpponentRoads = state.roads.filter((road) => {
      if (road.owner === player.id) {
        return false;
      }

      const edge = road.getEdge(state);
      if (!edge) {
        return false;
      }

      const intersectionIds = edge.getIntersections(state).map((i) => i.id);
      return intersectionIds.includes(payload.intersectionId);
    });

    if (affectedOpponentRoads.length === 0) {
      return;
    }

    const opponentIds = Array.from(
      new Set(affectedOpponentRoads.map((r) => r.owner))
    );
    
    for (const ownerId of opponentIds) {
      const opponent = state.players.get(ownerId);
      if (opponent) {
        opponent.longestRoadLength = calculateLongestRoad(state, opponent);
        setLongestRoad(this.state);
      }
    }
  }
}
