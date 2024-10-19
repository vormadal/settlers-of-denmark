import { Point as Schema } from "../rooms/schema/MyRoomState";

export class Point {
  constructor(public readonly x: number, public readonly y: number) { }

  GetStateSchema() {
    const schema = new Schema()
    schema.x = this.x
    schema.y = this.y
    return schema
  }

  AddPoint(point: Point) {
    const pX = this.x + point.x
    const pY = this.y + point.y

    return new Point(pX, pY)
  }

  IsTheSameAs(point: Point, decimal: number = 8){
    const p1x = Math.round(this.x)
    
  }
}
