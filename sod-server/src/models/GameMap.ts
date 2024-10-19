import { LayoutAlgorithm } from "../algorithms/layout/LayoutAlgorithm";
import { MyRoomState } from "../rooms/schema/MyRoomState";
import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";

export class GameMap {
  borderEdges: BorderEdge[] = [];
  intersections: Intersection[] = [];
  landTiles: LandTiles[] = [];

  constructor(public readonly id: string) {
    
  }

  get schema() {
    const state = new MyRoomState();
    state.LandTiles.push(...this.landTiles.map((x) => x.getStateSchema()));
    state.edges.push(...this.borderEdges.map((x) => x.getStateSchema()));
    state.intersections.push(
      ...this.intersections.map((x) => x.getStateSchema())
    );

    return state;
  }
}
