import { GameState } from "../../rooms/schema/GameState";
import { Intersection } from "../../rooms/schema/Intersection";
import { Road } from "../../rooms/schema/Road";
import { Edge } from "./Edge";
import { IslandHex } from "./IslandHex";

export class LongestPath {
  private readonly edges: Edge[] = [];
  private readonly lookup = new Map<string, Edge[]>();
  private hexIslandId = new Map<string, number>();
  private islandHexLookup = new Map<string, IslandHex>();
  private currentIslandId = 1;
  constructor(
    private readonly state: GameState,
    private readonly roads: Road[]
  ) {
    this.edges = roads.map((r) => new Edge(state, r, this.islandHexLookup));
    for (const edge of this.edges) {
      this.addToLookup(edge);
    }

    for (const edge of this.edges) {
      edge.connectionsA = this.getConnections(edge, edge.intersectionA);
      edge.connectionsB = this.getConnections(edge, edge.intersectionB);
    }

    const visited = new Set<string>();
    for (const edge of this.edges) {
      if (!visited.has(edge.id)) {
        this.visit(visited, edge);
      }
    }
  }

  private addToLookup(edge: Edge) {
    const listA = this.lookup.get(edge.intersectionA.id) ?? [];
    listA.push(edge);
    this.lookup.set(edge.intersectionA.id, listA);
    const listB = this.lookup.get(edge.intersectionB.id) ?? [];
    listB.push(edge);
    this.lookup.set(edge.intersectionB.id, listB);
  }
  private getConnections(edge: Edge, intersection: Intersection): Edge[] {
    return (this.lookup.get(intersection.id) ?? []).filter((e) => e !== edge);
  }

  addEdge(road: Road) {
    const edge = new Edge(this.state, road, this.islandHexLookup);
    this.addToLookup(edge);
    const existingGraph = this.edges.find((e) => e.isConnectedTo(edge));
    if (!existingGraph) {
      edge.hexA.islandId = this.currentIslandId++;
      edge.hexB.islandId = edge.hexA.islandId;
      this.edges.push(edge);
    } else {
      edge.connectionsA = this.getConnections(edge, edge.intersectionA);
      edge.connectionsB = this.getConnections(edge, edge.intersectionB);
      this.edges.push(edge);

      switch (edge.connections.length) {
        case 1:
          edge.hexA.islandId = existingGraph.hexA.islandId;
          edge.hexB.islandId = existingGraph.hexB.islandId;
          break;
        case 2:
          if (
            edge.connectionsA.length === 2 ||
            edge.connectionsB.length === 2
          ) {
            // do nothing, this edge connects two parts of the same island
          } else {
            // if all islandIds are the same, we created a loop, split the island
            // else merge the islands
          }
      }
    }
  }

  visit(visited: Set<string>, edge: Edge) {
    const islandAId =
      this.hexIslandId.get(edge.hexA.id) || this.currentIslandId++;
    let islandBId =
      (edge.hexB ? this.hexIslandId.get(edge.hexB.id) : null) ||
      this.currentIslandId++;

    switch (edge.connectionsA.length) {
      case 0:
        islandBId = islandAId;
        break;
    }

    if (!islandAId) {
      this.hexIslandId.set(edge.hexA.id, this.currentIslandId++);
    }
    if (edge.hexB && !islandBId) {
      this.hexIslandId.set(edge.hexB.id, this.currentIslandId++);
    }
  }
  solve(): Road[] {
    return [];
  }
}
