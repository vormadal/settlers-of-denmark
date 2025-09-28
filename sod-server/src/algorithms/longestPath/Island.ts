import { Hex } from "../../rooms/schema/Hex";
import { Edge } from "./Edge";

export class Island {
  constructor(public readonly edges: Edge[], public readonly hexes: Hex[]) {}
}
