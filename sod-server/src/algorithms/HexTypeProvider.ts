import { GameState } from '../rooms/schema/GameState'
import { HexTypes } from '../rooms/schema/Hex'
import { shuffleArray } from '../utils/arrayHelpers'

export interface HexTypeProvider {
  assign(gameState: GameState): void
}

export class RandomHexTypeProvider implements HexTypeProvider {
  constructor(private readonly availableTypes: string[]) {}

  assign(gameState: GameState) {
    for (const hex of gameState.hexes) {
      const index = Math.round(Math.random() * this.availableTypes.length)
      hex.type = this.availableTypes[index]
    }
  }
}

export class PercentageHexTypeProvider implements HexTypeProvider {
  static default() {
    return new PercentageHexTypeProvider({
      [HexTypes.Desert]: (1 / 19) * 100,
      [HexTypes.Forest]: (4 / 19) * 100,
      [HexTypes.Fields]: (4 / 19) * 100,
      [HexTypes.Pastures]: (4 / 19) * 100,
      [HexTypes.Mountains]: (3 / 19) * 100,
      [HexTypes.Hills]: (3 / 19) * 100
    })
  }
  constructor(private readonly hexDistribution: { [key: string]: number }) {
    const values = Object.values(hexDistribution)
    const total = values.reduce((v, percentage) => {
      return v + percentage
    }, 0)
    if (Math.round(total) !== 100) {
      throw new Error('distribution should sum up to 100 actual value was ' + total)
    }
  }

  assign(gameState: GameState) {
    const totalCount = gameState.hexes.length
    let index = 0
    let availableHexes = []
    const keys = Object.keys(this.hexDistribution)
    let sum = 0
    for (let i = 0; i < keys.length; i++) {
      const type = keys[i]
      const distribution = this.hexDistribution[type]
      let count = Math.round((totalCount * distribution) / 100)
      if (i >= keys.length - 1) {
        count = totalCount - sum
      }

      for (let j = 0; j < count; j++) {
        availableHexes.push(type)
      }

      sum += count
    }

    availableHexes = shuffleArray(availableHexes)

    for (const hex of gameState.hexes) {
      const type = availableHexes[index++ % availableHexes.length]
      hex.type = type ?? HexTypes.Desert
    }
  }
}
