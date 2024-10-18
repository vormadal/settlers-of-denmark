import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";
import { Point } from "./Point";

export class BorderEdge {
  constructor(
    public readonly id: string,
    public readonly pointA: Point,
    public readonly pointB: Point,
    public readonly adjacentTiles: LandTiles[],
    public readonly adjacentIntersections: Intersection[],
    public readonly adjacentBorderEdges: BorderEdge[]
  ) {}
}
