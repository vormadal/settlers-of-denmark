import { Schema, type } from '@colyseus/schema'

export class Point extends Schema {
  @type('number') x: number
  @type('number') y: number

  get id() {
    return `${Math.round(this.x)},${Math.round(this.y)}`
  }

  add(p: Point) {
    return createPoint(this.x + p.x, this.y + p.y)
  }

  subtract(p: Point) {
    return createPoint(this.x - p.x, this.y - p.y)
  }

  distance(p: Point) {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2))
  }

  copy() {
    return createPoint(this.x, this.y)
  }

  normalize() {
    const length = this.distance(createPoint(0, 0))
    return createPoint(this.x / length, this.y / length)
  }

  multiply(scalar: number) {
    return createPoint(this.x * scalar, this.y * scalar)
  }
}

export function createPoint(x: number, y: number) {
  return new Point().assign({
    x,
    y
  })
}
