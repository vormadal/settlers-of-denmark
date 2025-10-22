import { Vector } from 'ts-matrix'
import Point from './Point'

export function getCenter(points: Point[]): Point {
  const center: Point = { x: 0, y: 0 }
  points.forEach((point) => {
    center.x += point.x
    center.y += point.y
  })
  center.x /= points.length
  center.y /= points.length
  return center
}

export function getLineRotation(pointA: Point, pointB: Point) {
  const v = new Vector([pointA.x - pointB.x, pointA.y - pointB.y])
  let baseVector = new Vector([1, 0])

  if (v.at(1) < 0) {
    baseVector = new Vector([-1, 0])
  }

  const test = v.angleFrom(baseVector)
  const degrees = Math.round((test * 180) / Math.PI)
  return degrees % 360
}
