import { Die } from '../rooms/schema/Die'
import { GameState } from '../rooms/schema/GameState'
import { DiceCup } from './DiceCup'

/**
 * Fixed dice cup that rolls dice in a predictable sequence from 2 to 12.
 * This ensures reproducible game outcomes for testing.
 */
export class FixedDiceCup implements DiceCup {
  state: GameState
  private currentIndex = 0
  
  // Sequence that produces rolls from 2 to 12 by combining two dice values
  private readonly sequence = [
    { die1: 1, die2: 1 }, // 2
    { die1: 1, die2: 2 }, // 3
    { die1: 1, die2: 3 }, // 4
    { die1: 1, die2: 4 }, // 5
    { die1: 1, die2: 5 }, // 6
    { die1: 2, die2: 5 }, // 7
    { die1: 2, die2: 6 }, // 8
    { die1: 3, die2: 6 }, // 9
    { die1: 4, die2: 6 }, // 10
    { die1: 5, die2: 6 }, // 11
    { die1: 6, die2: 6 }, // 12
  ]

  init(state: GameState): void {
    this.state = state
    state.dice.push(Die.createRegular('yellow'), Die.createRegular('red'))
  }

  roll(): void {
    const roll = this.sequence[this.currentIndex % this.sequence.length]
    this.state.dice[0].value = roll.die1
    this.state.dice[1].value = roll.die2
    this.currentIndex++
  }
}
