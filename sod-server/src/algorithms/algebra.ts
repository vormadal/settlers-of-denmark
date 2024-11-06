import { Point } from '../rooms/schema/Point'

export function addPoints(p1: Point, p2: Point) {
  return createPoint(p1.x + p2.x, p1.y + p2.y)
}

export function createPoint(x: number, y: number) {
  return new Point().assign({
    x: Math.round(x),
    y: Math.round(y)
  })
}

export function copyPoint(point: Point) {
  return createPoint(point.x, point.y)
}
