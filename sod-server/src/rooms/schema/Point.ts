import { Schema, type } from "@colyseus/schema";

export class Point extends Schema {
    @type("number") x: number;
    @type("number") y: number;
  }