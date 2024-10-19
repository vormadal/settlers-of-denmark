import { Schema, type } from "@colyseus/schema";
import { Point } from "./Point";

export class BorderEdge extends Schema {
  @type(Point) pointA: Point;
  @type(Point) pointB: Point;
  @type("string") id: string;
}
