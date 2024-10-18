import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Point extends Schema{
  @type("number") x: number;
  @type("number") y: number;
}

export class BorderEdge extends Schema{
  @type(Point) pointA: Point;
  @type(Point) pointB: Point;
  @type("string") id: string;
}

export class Intersection extends Schema{
  @type(Point) position: Point;
  @type("string") id: string;
}

export class LandTiles extends Schema{
  @type(Point) position: Point;
  @type("string") id: string;
}

export class MyRoomState extends Schema {
  @type([BorderEdge]) edges = new ArraySchema<BorderEdge>();
  @type([Intersection]) intersections = new ArraySchema<Intersection>();
  @type([LandTiles]) LandTiles = new ArraySchema<LandTiles>();
}
