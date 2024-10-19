import { Schema, type } from "@colyseus/schema";
import { Point } from "./Point";

export class Intersection extends Schema {
    @type(Point) position: Point;
    @type("string") id: string;
  }