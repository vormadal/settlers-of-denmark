import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Point } from "./Point";

export class LandTiles extends Schema {
  @type(Point) position: Point;
  @type("number") radius: number;
  @type("string") id: string;
  @type("string") type: string;
  @type(["string"]) edges = new ArraySchema<string>();
  @type(["string"]) intersections = new ArraySchema<string>();
  @type("number") value?: number;
}
