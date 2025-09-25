import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../../rooms/MyRoom'
import { CardVariants } from '../../../rooms/schema/Card'
import { Player } from '../../../rooms/schema/Player'
import { GameState } from '../../../rooms/schema/GameState'

interface Payload {
  initialPlacement: boolean
}
export class SetAvailableRoadEdgesCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    const player = this.state.players.get(this.state.currentPlayer)

    if(player.roads.filter((x) => !x.edge).length === 0){
      console.log('No available roads to place')
      return
    }

    const currentDevelopmentCardId = this.room.state.currentDevelopmentCardId

    console.log('Setting available road edges for player', currentDevelopmentCardId)

    if (currentDevelopmentCardId) {
      const card = this.state.deck.find((c) => c.id === currentDevelopmentCardId)
      if (card?.variant === CardVariants.RoadBuilding) {
        updateAvailableRoadEdges(this.state, player)
        return
      }
    }

    if (payload.initialPlacement) {
      const structures = player.structures.filter((x) => x.intersection) ?? []
      const settlement = structures.find((x) => x.getRoads(this.state).length === 0)
      this.state.availableEdges = new ArraySchema(...settlement.getEdges(this.state).map((x) => x.id))
      console.log('Initial placement, available edges:', this.state.availableEdges)
      return
    }

    if (
      ![CardVariants.Brick, CardVariants.Lumber].every((variant) => player.cardsOfType(this.state, variant).length > 0)
    ) {
      console.log('Not enough resources to build a road')
      return
    }

    updateAvailableRoadEdges(this.state, player)
  }
}

const updateAvailableRoadEdges = (state: GameState, player: Player) => {
      const occupiedEdgeIds = state.roads.filter((x) => x.edge).map((x) => x.edge)

      const playerOccupiedEdges = player.roads
        .filter((x) => x.edge)
        .map((x) => state.edges.find((edge) => edge.id === x.edge))

      const availableEdges = playerOccupiedEdges
        .map((x) => x.getConnectedEdges(state))
        .flat()
        .filter((x) => !occupiedEdgeIds.includes(x.id))

      state.availableEdges = new ArraySchema<string>(...availableEdges.map((x) => x.id))
    }