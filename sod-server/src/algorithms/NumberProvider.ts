import { GameState } from '../rooms/schema/GameState'
import { BaseGameTileTypes, LandTiles } from '../rooms/schema/LandTile'
import { shuffleArray } from '../utils/arrayHelpers'

export interface NumberProvider {
  assign(gameState: GameState): void
}

export class RandomNumberProvider implements NumberProvider {
  values = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]
  assign(gameState: GameState): void {
    for (const hex of gameState.landTiles) {
      hex.value = this.values[Math.round(Math.random() * (this.values.length - 1))]
    }
  }
}

export class DebugNumberProvider implements NumberProvider {
  assign(gameState: GameState): void {
    let value = 0
    for (const hex of gameState.landTiles) {
      hex.value = value++
    }
  }
}

export class BalancedNumberProvider implements NumberProvider {
  values = shuffleArray([2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12])

  assign(gameState: GameState): void {
    let index = 0
    for (const hex of gameState.landTiles) {
      if (hex.type !== BaseGameTileTypes.Dessert) {
        hex.value = this.values[index++ % this.values.length]
      }
    }
  }
}
