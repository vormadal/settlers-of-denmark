import { GameState } from '../rooms/schema/GameState'
import { HexTypes } from '../rooms/schema/Hex'
import { HexTypeProvider } from './HexTypeProvider'

/**
 * Fixed hex type provider that always assigns the same hex types in the same order.
 * This ensures reproducible board layouts for testing.
 */
export class FixedHexTypeProvider implements HexTypeProvider {
  // Fixed sequence matching the default Catan distribution: 4 forests, 4 fields, 4 pastures, 3 mountains, 3 hills, 1 desert
  private readonly fixedTypes = [
    HexTypes.Forest,
    HexTypes.Fields,
    HexTypes.Pastures,
    HexTypes.Mountains,
    HexTypes.Hills,
    HexTypes.Forest,
    HexTypes.Fields,
    HexTypes.Pastures,
    HexTypes.Mountains,
    HexTypes.Hills,
    HexTypes.Forest,
    HexTypes.Fields,
    HexTypes.Pastures,
    HexTypes.Mountains,
    HexTypes.Hills,
    HexTypes.Forest,
    HexTypes.Fields,
    HexTypes.Pastures,
    HexTypes.Desert
  ]

  assign(gameState: GameState): void {
    let index = 0
    for (const hex of gameState.hexes) {
      hex.type = this.fixedTypes[index % this.fixedTypes.length]
      index++
    }
  }
}
