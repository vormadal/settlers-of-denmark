import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { Point } from "./Point";
import { LandTiles as Schema } from "../rooms/schema/MyRoomState";
export class LandTiles {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly position: Point,
    public readonly edges: BorderEdge[],
    public readonly intersections: Intersection[]
  ) {}

  getStateSchema(){
    const schema = new Schema()
    schema.position = this.position.GetStateSchema()
    schema.id = this.id
    schema.type = this.type

    return schema
  }
}
