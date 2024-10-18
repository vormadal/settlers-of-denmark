import { BorderEdge } from "./BorderEdge";
import { LandTiles } from "./LandTiles";
import { Point } from "./Point";

export class Intersection {
  constructor(
    public readonly id: string,
    public readonly position: Point,
    public readonly adjacentTiles: LandTiles[],
    public readonly adjacentBorderEdges: BorderEdge[]
  ) {}
}
