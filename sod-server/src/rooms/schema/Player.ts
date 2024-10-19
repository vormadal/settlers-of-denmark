import { ArraySchema, Schema, type } from "@colyseus/schema";
import { House } from "./House";
import { Road } from "./Road";

export class Player extends Schema {
  @type("string") id: string;
  @type([House]) houses = new ArraySchema<House>();
  @type([Road]) roads = new ArraySchema<Road>();
}
