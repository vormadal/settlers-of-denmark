import { GameState } from '../rooms/schema/GameState'
import { BaseGameTileTypes } from '../rooms/schema/LandTile'
import { shuffleArray } from '../utils/arrayHelpers'

export interface TileTypeProvider {
  assign(gameState: GameState): void
}

export class RandomTileTypeProvider implements TileTypeProvider {
  constructor(private readonly availableTypes: string[]) {}

  assign(gameState: GameState) {
    for (const tile of gameState.landTiles) {
      const index = Math.round(Math.random() * this.availableTypes.length)
      tile.type = this.availableTypes[index]
    }
  }
}

export class PercentageTileTypeProvider implements TileTypeProvider {
  static default() {
    return new PercentageTileTypeProvider({
      [BaseGameTileTypes.Dessert]: (1 / 19) * 100,
      [BaseGameTileTypes.Forest]: (4 / 19) * 100,
      [BaseGameTileTypes.Fields]: (4 / 19) * 100,
      [BaseGameTileTypes.Pastures]: (4 / 19) * 100,
      [BaseGameTileTypes.Mountains]: (3 / 19) * 100,
      [BaseGameTileTypes.Hills]: (3 / 19) * 100
    })
  }
  constructor(private readonly tileDistribution: { [key: string]: number }) {
    const values = Object.values(tileDistribution)
    const total = values.reduce((v, percentage) => {
      return v + percentage
    }, 0)
    if (Math.round(total) !== 100) {
      throw new Error('distribution should sum up to 100 actual value was ' + total)
    }
  }

  assign(gameState: GameState) {
    const totalCount = gameState.landTiles.length
    let index = 0
    let availableTiles = []
    const keys = Object.keys(this.tileDistribution)
    let sum = 0
    for (let i = 0; i < keys.length; i++) {
      const type = keys[i]
      const distribution = this.tileDistribution[type]
      let count = Math.round((totalCount * distribution) / 100)
      if (i >= keys.length - 1) {
        count = totalCount - sum
      }

      for (let j = 0; j < count; j++) {
        availableTiles.push(type)
      }

      sum += count
    }

    availableTiles = shuffleArray(availableTiles)

    for (const tile of gameState.landTiles) {
      const type = availableTiles[index++ % availableTiles.length]
      tile.type = type ?? BaseGameTileTypes.Dessert
    }
  }
}
