import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Point } from "./Point";

export const BaseGameTileTypes = {
  Dessert: "Dessert",
  Forrest: "Forrest",
  Mountains: "Mountains",
  Lifestock: "Lifestock",
  Mine: "Mine",
  Grain: "Grain",
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
