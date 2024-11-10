import { Die } from '../rooms/schema/Die'
import { GameState } from '../rooms/schema/GameState'

export interface DiceCup {
  init(state: GameState): void
  roll(): void
}
export class BaseGameDiceCup implements DiceCup {
  state: GameState

  init(state: GameState): void {
    this.state = state
    state.dice.push(
      new Die().assign({ color: 'yellow', type: 'number', value: 1 }),
      new Die().assign({ color: 'red', type: 'number', value: 1 })
    )
  }
  roll(): void {
    this.state.dice.forEach((die) => {
      die.value = Math.floor(Math.random() * 6) + 1
    })
  }
}
