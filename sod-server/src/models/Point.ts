import { Point as Schema } from "../rooms/schema/MyRoomState";

export class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  GetStateSchema(){
    const schema = new Schema()
    schema.x = this.x
    schema.y = this.y
    return schema

  }
}
