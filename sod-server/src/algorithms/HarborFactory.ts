import { GameState } from "../rooms/schema/GameState";
import { Harbor } from "../rooms/schema/Harbor";
import { BorderEdge } from "../rooms/schema/BorderEdge";
import { ResourceCardVariants } from "../rooms/schema/Card";

const harborPositionsDefault: [number, string, number][] = [
  [0, "Any", 3],
  [3, ResourceCardVariants.Wool, 2],
  [7, "Any", 3],
  [10, "Any", 3],
  [13, ResourceCardVariants.Brick, 2],
  [17, ResourceCardVariants.Lumber, 2],
  [20, "Any", 3],
  [23, ResourceCardVariants.Grain, 2],
  [27, ResourceCardVariants.Ore, 2],
];

export class HarborFactory {
  harbors: Harbor[] = [];

  createHarbors(gameState: GameState) {
    let coastalEdges = gameState.edges.filter(
      (e) => e.getAdjacentHexes(gameState).length === 1
    );
    coastalEdges.sort((a, b) => a.id.localeCompare(b.id));
    coastalEdges = this.orderEdgesLoop(gameState, coastalEdges);

    for (const [number, cardType, ratio] of harborPositionsDefault) {
      const edge = coastalEdges[number];
      const harbor = new Harbor().assign({
        id: `harbor:${edge.id}`,
        edge: edge,
        cardTypes:
          cardType === "Any"
            ? [ResourceCardVariants.Brick, ResourceCardVariants.Lumber, ResourceCardVariants.Ore, ResourceCardVariants.Grain, ResourceCardVariants.Wool]
            : [cardType],
        ratio: ratio,
      });

      this.harbors.push(harbor);
    }

    gameState.harbors.clear();
    gameState.harbors.push(...this.harbors);
  }

  orderEdgesLoop(gameState: GameState, edges: BorderEdge[]) {
    if (edges.length === 0) return [];

    const tolerance = 0.1;
    let start = edges.find(
      e =>
        e.getConnectedEdges(gameState).length === 2 &&
        Math.abs(e.pointA.y - e.pointB.y) < tolerance
    );
    if (!start) {
      start = edges.find(
        e =>
          e.getConnectedEdges(gameState).length === 2 &&
          Math.abs(e.pointA.x - e.pointB.x) < tolerance
      );
    }

    if (!start) {
        start = edges[0];
    }

    const ordered: BorderEdge[] = [start];
    const visited = new Set<string>([start.id]);
    const edgeIdSet = new Set(edges.map(e => e.id));

    while (ordered.length < edges.length) {
      const last = ordered[ordered.length - 1];
      // Use existing API to fetch candidate connections, restrict to coastal edge set, exclude visited.
      let candidates = last
        .getConnectedEdges(gameState)
        .filter(e => edgeIdSet.has(e.id) && !visited.has(e.id));

      if (candidates.length === 0) break;

      // Deterministic pick: sort by id so order is stable across runs.
      candidates.sort((a, b) => a.id.localeCompare(b.id));
      const next = candidates[0];
      ordered.push(next);
      visited.add(next.id);
    }

    // If disconnected segments exist, append remaining edges in original order for completeness.
    if (ordered.length !== edges.length) {
      for (const e of edges) if (!visited.has(e.id)) ordered.push(e);
    }
    return ordered;
  }
}
