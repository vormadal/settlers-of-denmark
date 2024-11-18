import { GameState } from '../rooms/schema/GameState'
import { HexTypes, Hex } from '../rooms/schema/Hex'
import { shuffleArray } from '../utils/arrayHelpers'

export interface NumberTokenProvider {
  assign(gameState: GameState): void
}

export class RandomNumberTokenProvider implements NumberTokenProvider {
  values = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]
  assign(gameState: GameState): void {
    for (const hex of gameState.hexes) {
      hex.value = this.values[Math.round(Math.random() * (this.values.length - 1))]
    }
  }
}

export class DebugNumberTokenProvider implements NumberTokenProvider {
  assign(gameState: GameState): void {
    let value = 0
    for (const hex of gameState.hexes) {
      hex.value = value++
    }
  }
}

export class BalancedNumberTokenProvider implements NumberTokenProvider {
  values = shuffleArray([2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12])

  assign(gameState: GameState): void {
    let index = 0
    for (const hex of gameState.hexes) {
      if (hex.type !== HexTypes.Dessert) {
        hex.value = this.values[index++ % this.values.length]
      }
    }
  }
}

export class DefaultNumberTokenProvider implements NumberTokenProvider {
  values = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]

  assign(gameState: GameState): void {
    let index = 0
    for (const hex of gameState.hexes) {
      if (hex.type !== HexTypes.Dessert) {
        hex.value = this.values[index % this.values.length]
        index++
      }
    }
  }
}
