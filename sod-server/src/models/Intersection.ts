import { BorderEdge } from "./BorderEdge";
import { Intersection as Schema } from "../rooms/schema/MyRoomState";
import { Point } from "./Point";
import { LandTiles } from "./LandTiles";

export class Intersection {
  constructor(
    public readonly id: string,
    public readonly position: Point,
    public readonly adjacentTiles: LandTiles[],
    public readonly adjacentBorderEdges: BorderEdge[]
  ) {}

  getStateSchema() {
    const schema = new Schema();
    schema.position = this.position.GetStateSchema();
    schema.id = this.id;
    return schema;
  }

  isSameAs(inter: Intersection){
    return this.position.IsTheSameAs(inter.position)
  }
}
