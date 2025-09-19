import { Command } from "@colyseus/command";
import { MyRoom } from "../../../rooms/MyRoom";
import { GameState } from "../../../rooms/schema/GameState";
import { Player } from "../../../rooms/schema/Player";
import { Road } from "../../../rooms/schema/Road";
import { Point } from "../../../rooms/schema/Point";

export interface Payload {
  playerId: string;
}

export class UpdatePlayerLongestRoadCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(payload.playerId);
    if (!player) {
      return;
    }

    player.longestRoadLength = calculateLongestRoad(this.state, player);
    setLongestRoad(this.state);
  }
}

export function setLongestRoad(state: GameState){
  let playerIdWithLongestRoad: string | null = null;
  let longestRoadLength = 4;

  for (const player of state.players.values()) {
    if (player.longestRoadLength > longestRoadLength) {
      longestRoadLength = player.longestRoadLength;
      playerIdWithLongestRoad = player.id;
    }
  }

  state.hasLongestRoad = playerIdWithLongestRoad;
}

export function calculateLongestRoad(state: GameState, player: Player) {
  const playerRoads = state.roads.filter((r) => r.owner === player.id);
  if (playerRoads.length === 0) {
    // No roads, no longest road
    return 0;
  }

  if (playerRoads.length === 1) {
    player.longestRoadLength = 1;
    return 1;
  }

  // Build a graph of the player's roads
  const roadGraph: Map<Road, Set<Road>> = new Map();

  for (const road of playerRoads) {
    const startEdge = road.getEdge(state);

    // Skip this road if the edge is missing
    if (!startEdge) {
      continue;
    }

    // Skip this road if pointA or pointB are missing
    if (!startEdge.pointA || !startEdge.pointB) {
      continue;
    }

    const edgePoints = startEdge.getAllPoints(state);
    if (edgePoints.length < 2) {
      continue;
    }

    const pointA = edgePoints[0].id;
    const pointB = edgePoints[1].id;

    // Skip if either point ID is missing
    if (!pointA || !pointB) {
      continue;
    }

    let connections = new Set<Road>();

    for (const otherRoad of playerRoads) {
      const otherEdge = otherRoad.getEdge(state);

      // Skip this road if the edge is missing
      if (!otherEdge) {
        continue;
      }

      // Skip this road if pointA or pointB are missing
      if (!otherEdge.pointA || !otherEdge.pointB) {
        continue;
      }

      const otherPointA = otherEdge.pointA.id;
      const otherPointB = otherEdge.pointB.id;

      // Skip if either point ID is missing
      if (!otherPointA || !otherPointB) {
        continue;
      }

      if (otherPointA && otherPointB) {
        if (
          otherPointA === pointA ||
          otherPointA === pointB ||
          otherPointB === pointA ||
          otherPointB === pointB
        ) {
          connections.add(otherRoad);
        }
      }
    }

    roadGraph.set(road, connections);
  }

  let longestPath = 0;

  // Try each point as a starting point
  for (const road of roadGraph.keys()) {
    const pointsOnRoad = road.getAllPoints(state);

    for (const point of pointsOnRoad) {
      const pathLength = findLongestPath(
        roadGraph,
        point,
        road,
        1,
        new Set<Road>(),
        state
      );
      longestPath = Math.max(longestPath, pathLength);
    }
  }

  return longestPath;
}

function findLongestPath(
  roadGraph: Map<Road, Set<Road>>,
  comingFromPoint: Point,
  current: Road,
  currentLength: number,
  visited: Set<Road>,
  state: GameState
): number {
  visited.add(current);

  const neighbors = roadGraph.get(current);
  if (!neighbors) {
    return currentLength;
  }

  const pointsOnCurrent = current.getAllPoints(state);

  let pointsToContinue: Point;
  if (pointsOnCurrent[0].id === comingFromPoint.id) {
    pointsToContinue = pointsOnCurrent[1];
  } else {
    pointsToContinue = pointsOnCurrent[0];
  }
  
  for(const structure of state.structures) {
    const intersection = state.intersections.find(intersection => intersection.position.id === pointsToContinue.id);

    if(structure.owner !== current.owner && structure.intersection === intersection.id) {
      return currentLength;
    }
  }

  let maxLength = currentLength;
  for (const neighbor of neighbors) {
    if (
      neighbor
        .getAllPoints(state)
        .map((p) => p.id)
        .includes(comingFromPoint.id) ||
      visited.has(neighbor)
    ) {
      continue;
    }

    const pathLength = findLongestPath(
      roadGraph,
      pointsToContinue,
      neighbor,
      currentLength + 1,
      visited,
      state
    );
    maxLength = Math.max(maxLength, pathLength);
  }

  return maxLength;
}
