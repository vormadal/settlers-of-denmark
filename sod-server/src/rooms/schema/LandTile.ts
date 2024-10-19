import { Schema, type } from "@colyseus/schema";
import { Point } from "./Point";

export class LandTiles extends Schema {
  @type(Point) position: Point;
  @type("number") radius: number;
  @type("string") id: string;
  @type("string") type: string;
}
