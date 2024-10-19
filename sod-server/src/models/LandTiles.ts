import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { Point } from "./Point";
import { LandTiles as Schema } from "../rooms/schema/MyRoomState";

export const BaseGameTileTypes = {
  Dessert: "Dessert",
  Forrest: "Forrest",
  Mountains: "Mountains",
  Lifestock: "Lifestock",
  Mine: "Mine",
  Grain: "Grain",
};
export class LandTiles {
  public static RADIUS = 1;
  public readonly edges: BorderEdge[] = [];
  public readonly intersections: Intersection[] = [];

  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly position: Point
  ) {}

  getStateSchema() {
    const schema = new Schema();
    schema.position = this.position.GetStateSchema();
    schema.id = this.id;
    schema.type = this.type;
    schema.radius = LandTiles.RADIUS;
    return schema;
  }
}
