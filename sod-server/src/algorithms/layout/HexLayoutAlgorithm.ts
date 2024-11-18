import { Vector } from '../../utils/Vector'
import { LayoutAlgorithm } from './LayoutAlgorithm'

export const HEX_RADIUS = 100
export const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS

export class HexLayoutAlgorithm implements LayoutAlgorithm {
  constructor(private readonly r: number) {}

  createLayout(): Vector[] {
    const numEdges = 6

    const allPoints: Vector[] = []

    for (let i = 0; i < this.r; i++) {
      const numHexes = i == 0 ? 1 : i * numEdges + 1 - ((i - 1) * numEdges + 1)
      const angleOffset = Math.PI / numHexes
      let previousPoint: Vector | null = null
      const layerPoints: Vector[] = []

      // layer
      for (let j = 0; j < numHexes; j++) {
        const angle = this.getPointAngle(angleOffset, numHexes, j)
        const p = CalculatePoint(i, angle)
        if (previousPoint) {
          layerPoints.push(...this.CreatePointsBetween(previousPoint, p))
        }
        previousPoint = p
        layerPoints.push(p)
      }

      layerPoints.push(
        ...this.CreatePointsBetween(previousPoint, CalculatePoint(i, this.getPointAngle(angleOffset, numHexes, 0)))
      )

      // we need to rotate the outer layers so that sequence of points is in a nice clockwise outgoing spiral
      const from = Math.max(0, i - 1)
      if (-from < 0) {
        allPoints.push(...layerPoints.slice(-from))
        allPoints.push(...layerPoints.slice(0, -from))
      } else {
        allPoints.push(...layerPoints)
      }
    }
    return allPoints
  }

  getPointAngle(offset: number, numHexes: number, j: number) {
    return offset + ((Math.PI * 2) / numHexes) * j
  }

  CreatePointsBetween = (previousPoint: Vector, p: Vector) => {
    const points: Vector[] = []
    const distance = Math.abs(previousPoint.len(p))
    if (distance - HEX_WIDTH > 10) {
      const numPoints = Math.round(distance / HEX_WIDTH)
      for (let k = 1; k < numPoints; k++) {
        const newPoint = previousPoint.add(
          p
            .sub(previousPoint)
            .norm()
            .mul(HEX_WIDTH * k)
        )

        points.push(newPoint)
      }
    }
    return points
  }
}

function CalculatePoint(r: number, angle: number) {
  // angle = angle + Math.PI / 6
  const x = HEX_WIDTH * r * Math.cos(angle)
  const y = HEX_WIDTH * r * Math.sin(angle)
  return new Vector(x, y)
}
