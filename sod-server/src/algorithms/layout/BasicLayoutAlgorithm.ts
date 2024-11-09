import { GameState } from '../../rooms/schema/GameState'

import { NumberProvider } from '../NumberProvider'
import { TileTypeProvider } from '../TileTypeProvider'
import { LayoutAlgorithm } from './LayoutAlgorithm'

export class BasicLayoutAlgorithm extends LayoutAlgorithm {
  constructor(
    private readonly m: number,
    private readonly n: number,
    private readonly tileTypeProvider: TileTypeProvider,
    private readonly numberProvider: NumberProvider
  ) {
    super()
  }
  createLayout(state: GameState): GameState {
    this.state = state
    this.tileTypeProvider.init(2 * this.n * this.m)

    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const p1 = CalculatePoint(i, j)
        const p2 = CalculatePointAlt(i, j)

        const tile1 = this.createTile(p1, this.tileTypeProvider.nextType(), this.numberProvider.next())
        const tile2 = this.createTile(p2, this.tileTypeProvider.nextType(), this.numberProvider.next())

        this.state.landTiles.push(tile1, tile2)
      }
    }

    return state
  }
}

function CalculatePoint(m: number, n: number) {
  const x = 3 * m * 100
  const y = n * 100 * Math.sqrt(3)
  return createPoint(x, y)
}

function CalculatePointAlt(m: number, n: number) {
  const x = 3 * m * 100 + (3 * 100) / 2
  const y = (n * 100 + 0.5 * 100) * Math.sqrt(3)
  return createPoint(x, y)
}
