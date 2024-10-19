import { Point as Schema } from "../rooms/schema/Point";

export class Point {
  private readonly _schema: Schema;
  constructor(public readonly x: number, public readonly y: number) {
    this._schema = new Schema();
    this._schema.x = x;
    this._schema.y = y;
  }

  get id() {
    return `${this.x}${this.y}`;
  }
  get schema() {
    return this._schema;
  }

  AddPoint(point: Point) {
    const pX = this.x + point.x;
    const pY = this.y + point.y;

    return new Point(pX, pY);
  }

  IsTheSameAs(point: Point) {
    const decimalNumber = 100;

    const p1x = Math.round(this.x * decimalNumber) / decimalNumber;
    const p1y = Math.round(this.y * decimalNumber) / decimalNumber;
    const p2x = Math.round(point.x * decimalNumber) / decimalNumber;
    const p2y = Math.round(point.y * decimalNumber) / decimalNumber;

    if (p1x === p2x && p1y === p2y) {
      return true;
    }
    return false;
  }
}
