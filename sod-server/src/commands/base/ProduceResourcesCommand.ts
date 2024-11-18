import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { DieTypes } from '../../rooms/schema/Die'

export class ProduceResourcesCommand extends Command<MyRoom> {
  execute() {
    const diceRoll = this.state.dice.filter((x) => x.type === DieTypes.Regular).reduce((sum, die) => sum + die.value, 0)
    // robber
    if (diceRoll === 7) {
      return
    }

    const hexes = this.state.hexes.filter((x) => x.value === diceRoll)

    const currentPlayer = this.state.players.get(this.state.currentPlayer)
    const currentPlayerIndex = this.state.playerList.indexOf(currentPlayer)

    for (let i = 0; i < this.state.playerList.length; i++) {
      // in case the bank runs out of resources, we need to give resources in the correct order
      // starting from the current player then looping through the rest of the players
      const player = this.state.playerList[(i + currentPlayerIndex) % this.state.playerList.length]

      for (const hex of hexes) {
        const structures = this.state.structures.filter(
          (x) => hex.intersections.includes(x.intersection) && x.owner === player.id
        )

        for (const structure of structures) {
          const resources =
            this.state.hexProductions
              .find((x) => x.hexType === hex.type && x.structureType === structure.type)
              ?.getResources(this.state) || []

          for (const resource of resources) {
            resource.owner = structure.owner
          }
        }
      }
    }
  }
}
