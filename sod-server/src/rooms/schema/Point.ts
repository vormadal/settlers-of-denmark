import { Schema, type } from '@colyseus/schema'

export class Point extends Schema {
  @type('number') x: number
  @type('number') y: number

  get id() {
    return `${Math.round(this.x)},${Math.round(this.y)}`
  }

  copy() {
    return new Point().assign({
      x: this.x,
      y: this.y
    })
  }
}
