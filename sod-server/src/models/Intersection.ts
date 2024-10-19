import { BorderEdge } from "./BorderEdge";
import { Intersection as Schema } from "../rooms/schema/Intersection";
import { Point } from "./Point";
import { LandTiles } from "./LandTiles";

export class Intersection {
  public readonly adjacentTiles: LandTiles[] = [];
  public readonly adjacentBorderEdges: BorderEdge[] = [];
  constructor(public readonly id: string, public readonly position: Point) {}

  get schema() {
    const schema = new Schema();
    schema.position = this.position.schema;
    schema.id = this.id;
    return schema;
  }

  isSameAs(inter: Intersection) {
    return this.position.IsTheSameAs(inter.position);
  }
}
