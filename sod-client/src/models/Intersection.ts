import { BorderEdge } from "./BorderEdge";
import { LandTiles } from "./LandTiles";
import { Position } from "./Position";

export class Intersection {
  constructor(
    public readonly id: string,
    public readonly position: Position,
    public readonly adjacentTiles: LandTiles[],
    public readonly adjacentBorderEdges: BorderEdge[]
  ) {}
}
