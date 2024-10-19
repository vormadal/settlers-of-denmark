import { Schema, type } from "@colyseus/schema";

export class Road extends Schema {
  @type("string") id: string;
  @type("string") owner: string;
  @type("string") edge: string;
}
