import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export class RollDiceCommand extends Command<MyRoom> {
  diceValues: number[]
  constructor() {
    super()

    this.diceValues = Array.from({ length: 2 }, () => Math.floor(Math.random() * 6) + 1)
  }

  execute() {
    for (let i = 0; i < this.state.dice.length; i++) {
      this.state.dice[i].value = this.diceValues[i]
    }
    this.state.hasDiceBeenRolled = true;
  }
}
