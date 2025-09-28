import { GameState } from "../../rooms/schema/GameState";
import { Hex } from "../../rooms/schema/Hex";
import { Intersection } from "../../rooms/schema/Intersection";
import { Road } from "../../rooms/schema/Road";
import { Island } from "./Island";
import { IslandHex } from "./IslandHex";

export class Edge {
  get id() {
    return this.road.id;
  }
  intersectionA: Intersection;
  intersectionB: Intersection;

  get intersections() {
    return [this.intersectionA, this.intersectionB];
  }

  isConnectedTo(edge: Edge) {
    return this.intersections.some((i) =>
      edge.intersections.find((x) => x.id === i.id)
    );
  }

  connectionsA: Edge[] = [];
  connectionsB: Edge[] = [];

  get connections() {
    return [...this.connectionsA, ...this.connectionsB];
  }

  hexA: IslandHex;
  hexB: IslandHex;

  //   islandA: Island | null = null;
  //   islandB: Island | null = null;

  constructor(
    private readonly state: GameState,
    public readonly road: Road,
    islandHexLookup: Map<string, IslandHex>
  ) {
    const intersections = road.getEdge(this.state).getIntersections(this.state);
    this.intersectionA = intersections[0];
    this.intersectionB = intersections[1];

    const hexes = road.getEdge(state).getAdjacentHexes(state);
    this.hexA = islandHexLookup.get(hexes[0].id) ?? new IslandHex(hexes[0]);
    this.hexB = islandHexLookup.get(hexes[1].id) ?? new IslandHex(hexes[1]);
    islandHexLookup.set(this.hexA.hex.id, this.hexA);
    islandHexLookup.set(this.hexB.hex.id, this.hexB);
  }
}
