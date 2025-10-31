import { GameState } from '../rooms/schema/GameState'
import { HexTypes } from '../rooms/schema/Hex'
import { NumberTokenProvider } from './NumberTokenProvider'

/**
 * Fixed number token provider that always assigns the same number tokens in the same order.
 * This ensures reproducible board layouts for testing.
 * Uses the standard Catan number sequence for consistency.
 */
export class FixedNumberTokenProvider implements NumberTokenProvider {
  // Import the standard sequence from NumberTokenProvider to avoid duplication
  // Fixed sequence with proper distribution: 2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12 (18 tokens, no 7)
  private readonly fixedValues = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]

  assign(gameState: GameState): void {
    let index = 0
    for (const hex of gameState.hexes) {
      if (hex.type !== HexTypes.Desert) {
        hex.value = this.fixedValues[index % this.fixedValues.length]
        index++
      }
    }
  }
}
