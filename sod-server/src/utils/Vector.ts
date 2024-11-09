import { Point } from '../rooms/schema/Point'

export class Vector {
  constructor(public readonly x: number, public readonly y: number) {}

  add(p: Vector) {
    return new Vector(this.x + p.x, this.y + p.y)
  }

  sub(p: Vector) {
    return new Vector(this.x - p.x, this.y - p.y)
  }

  len(p: Vector) {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2))
  }

  copy() {
    return new Vector(this.x, this.y)
  }

  norm() {
    const length = this.len(new Vector(0, 0))
    return new Vector(this.x / length, this.y / length)
  }

  mul(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  rot(angle: number) {
    return new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  }

  toPoint() {
    return new Point().assign({
      x: Math.round(this.x),
      y: Math.round(this.y)
    })
  }

  static fromPoint(point: Point) {
    return new Vector(point.x, point.y)
  }

  static unit() {
    return new Vector(1, 0)
  }
}
