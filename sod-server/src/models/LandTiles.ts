import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { Point } from "./Point";

export class LandTiles {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly position: Point,
    public readonly edges: BorderEdge[],
    public readonly intersections: Intersection[]
  ) {}
}
