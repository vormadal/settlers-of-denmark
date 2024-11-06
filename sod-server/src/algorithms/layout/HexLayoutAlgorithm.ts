import { BorderEdge } from '../../rooms/schema/BorderEdge'
import { GameState } from '../../rooms/schema/GameState'
import { Intersection } from '../../rooms/schema/Intersection'
import { LandTiles } from '../../rooms/schema/LandTile'
import { Point } from '../../rooms/schema/Point'
import { createPoint } from '../algebra'
import { NumberProvider } from '../NumberProvider'
import { TileTypeProvider } from '../TileTypeProvider'
import { LayoutAlgorithm } from './LayoutAlgorithm'

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

    for (let i = 0; i < this.r; i++) {
      const numTiles = i == 0 ? 1 : i * numEdges + 1 - ((i - 1) * numEdges + 1)
      const angleOffset = Math.PI / numTiles
      for (let j = 0; j < numTiles; j++) {
        const angle = angleOffset + ((Math.PI * 2) / numTiles) * j
        const p = CalculatePoint(i, angle)
        const tile = this.createTile(p, this.tileTypeProvider.nextType(), this.numberProvider.next())
        this.state.landTiles.push(tile)
      }
    }

    return state
  }
}

const width = 200
function CalculatePoint(r: number, angle: number) {
  // angle = angle + Math.PI / 6
  const x = width * r * Math.cos(angle)
  const y = width * r * Math.sin(angle)
  return createPoint(x, y)
}
