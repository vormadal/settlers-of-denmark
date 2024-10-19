import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { Point } from "./Point";
import { LandTiles as Schema } from "../rooms/schema/LandTile";

export const BaseGameTileTypes = {
  Dessert: "Dessert",
  Forrest: "Forrest",
  Mountains: "Mountains",
  Lifestock: "Lifestock",
  Mine: "Mine",
  Grain: "Grain",
};
export class LandTiles {
  public static RADIUS = 100;
  private readonly _edges: BorderEdge[] = [];
  private readonly _intersections: Intersection[] = [];

  private readonly _schema: Schema;
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly position: Point,
    public readonly number: number
  ) {
    this._schema = new Schema();
    this._schema.id = id;
    this._schema.type = type;
    this._schema.position = position.schema;
    this._schema.radius = LandTiles.RADIUS;
    this._schema.value = number;
  }

  set edges(value: BorderEdge[]) {
    this._edges.push(...value);
    this._schema.edges.push(...value.map((x) => x.id));
  }

  get edges() {
    return this._edges;
  }

  set intersections(value: Intersection[]) {
    this._intersections.push(...value);
    this._schema.intersections.push(...value.map((x) => x.id));
  }

  get intersections() {
    return this._intersections;
  }

  get schema() {
    return this._schema;
  }
}
