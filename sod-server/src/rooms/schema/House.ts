import { Schema, type } from "@colyseus/schema";

export class House extends Schema {
  @type("string") id: string;
  @type("string") owner: string;
  @type("string") intersection?: string;
}
