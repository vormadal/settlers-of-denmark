import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Point } from "./Point";

export const BaseGameTileTypes = {
  Dessert: "Dessert",
  Forest: "Forest",
  Mountains: "Mountains",
  Pastures: "Pastures",
  Hills: "Hills",
  Fields: "Fields",
};
export class LandTiles extends Schema {
  @type(Point) position: Point;
  @type("number") radius: number;
  @type("string") id: string;
  @type("string") type: string;
  @type(["string"]) edges = new ArraySchema<string>();
  @type(["string"]) intersections = new ArraySchema<string>();
  @type("number") value?: number;
}
