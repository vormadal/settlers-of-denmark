import { Vector } from 'ts-matrix'
import { Point } from '../state/Point'

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

export function getCenter(pointA: Point, pointB: Point) {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2
  }
}
