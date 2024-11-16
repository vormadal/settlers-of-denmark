import { BorderEdge } from '../../rooms/schema/BorderEdge'
import { GameState } from '../../rooms/schema/GameState'
import { Intersection } from '../../rooms/schema/Intersection'
import { LandTiles } from '../../rooms/schema/LandTile'
import { Point } from '../../rooms/schema/Point'
import { Vector } from '../../utils/Vector'
import { NumberProvider } from '../NumberProvider'
import { TileTypeProvider } from '../TileTypeProvider'
import { LayoutAlgorithm } from './LayoutAlgorithm'

const width = Math.sqrt(3) * 100
export class HexLayoutAlgorithm extends LayoutAlgorithm {
  constructor(
    private readonly r: number,
    private readonly tileTypeProvider: TileTypeProvider,
    private readonly numberProvider: NumberProvider
  ) {
    super()
  }
  createLayout(state: GameState): GameState {
    this.state = state
    const numEdges = 6
    const totalNumTiles = this.r * numEdges + 1
    this.tileTypeProvider.init(totalNumTiles)

    const allPoints: Vector[] = []

    for (let i = 0; i < this.r; i++) {
      const numTiles = i == 0 ? 1 : i * numEdges + 1 - ((i - 1) * numEdges + 1)
      const angleOffset = Math.PI / numTiles
      let previousPoint: Vector | null = null
      const layerPoints: Vector[] = []

      // layer
      for (let j = 0; j < numTiles; j++) {
        const angle = this.getPointAngle(angleOffset, numTiles, j)
        const p = CalculatePoint(i, angle)
        if (previousPoint) {
          layerPoints.push(...this.CreatePointsBetween(previousPoint, p))
        }
        previousPoint = p
        layerPoints.push(p)
      }

      layerPoints.push(
        ...this.CreatePointsBetween(previousPoint, CalculatePoint(i, this.getPointAngle(angleOffset, numTiles, 0)))
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

    for (const point of allPoints) {
      this.state.landTiles.push(this.createTile(point, this.tileTypeProvider.nextType(), this.numberProvider.next()))
    }

    return state
  }

  getPointAngle(offset: number, numTiles: number, j: number) {
    return offset + ((Math.PI * 2) / numTiles) * j
  }

  CreatePointsBetween = (previousPoint: Vector, p: Vector) => {
    const points: Vector[] = []
    const distance = Math.abs(previousPoint.len(p))
    if (distance - width > 10) {
      const numPoints = Math.round(distance / width)
      for (let k = 1; k < numPoints; k++) {
        const newPoint = previousPoint.add(
          p
            .sub(previousPoint)
            .norm()
            .mul(width * k)
        )

        points.push(newPoint)
      }
    }
    return points
  }
}

function CalculatePoint(r: number, angle: number) {
  // angle = angle + Math.PI / 6
  const x = width * r * Math.cos(angle)
  const y = width * r * Math.sin(angle)
  return new Vector(x, y)
}
