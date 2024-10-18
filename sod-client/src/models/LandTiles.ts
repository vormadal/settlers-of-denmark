import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { Position } from "./Position";

export class LandTiles {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly position: Position,
    public readonly edges: BorderEdge[],
    public readonly intersections: Intersection[]
  ) {}
}
