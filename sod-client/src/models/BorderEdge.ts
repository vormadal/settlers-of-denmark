import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";
import { Position } from "./Position";

export class BorderEdge {
  constructor(
    public readonly id: string,
    public readonly position: Position,
    public readonly adjacentTiles: LandTiles[],
    public readonly adjacentIntersections: Intersection[],
    public readonly adjacentBorderEdges: BorderEdge[]
  ) {}
}
