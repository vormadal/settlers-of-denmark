import { Dispatcher } from '@colyseus/command'
import { Client, Room } from '@colyseus/core'
import { BasicLayoutAlgorithm } from '../algorithms/layout/BasicLayoutAlgorithm'
import { PercentageTileTypeProvider } from '../algorithms/TileTypeProvider'
import { PlaceInitialHouseCommand } from '../commands/base/PlaceInitialHouseCommand'
import { PlaceInitialRoadCommand } from '../commands/base/PlaceInitialRoadCommand'
import { GamePhases, GameState, PhaseSteps } from './schema/GameState'
import { House } from './schema/House'
import { Player } from './schema/Player'
import { Road } from './schema/Road'

import { RandomNumberProvider } from '../algorithms/NumberProvider'
import { BaseGameTileTypes } from './schema/LandTile'

export interface GameMapOptions {
  numPlayers: number
  numHouses: number
  numCities: number
  numRoads: number
}

export class MyRoom extends Room<GameState> {
  maxClients = 2
  options: GameMapOptions
  dispatcher = new Dispatcher(this)
  layoutAlgorithm = new BasicLayoutAlgorithm(
    3,
    4,
    new PercentageTileTypeProvider({
      [BaseGameTileTypes.Dessert]: (1 / 19) * 100,
      [BaseGameTileTypes.Forrest]: (4 / 19) * 100,
      [BaseGameTileTypes.Grain]: (4 / 19) * 100,
      [BaseGameTileTypes.Lifestock]: (4 / 19) * 100,
      [BaseGameTileTypes.Mountains]: (3 / 19) * 100,
      [BaseGameTileTypes.Mine]: (3 / 19) * 100
    }),
    new RandomNumberProvider()
  )

  onCreate(options: GameMapOptions) {
    this.options = {
      numCities: 4,
      numHouses: 4,
      numPlayers: 1,
      numRoads: 9,
      ...options
    }

    this.maxClients = options.numPlayers
    const state = this.layoutAlgorithm.createLayout(new GameState())
    this.setState(state)

    this.onMessage<Pick<PlaceInitialHouseCommand['payload'], 'intersectionId'>>('place_house', (client, message) => {
      this.executeCommand(() => {
        this.dispatcher.dispatch(new PlaceInitialHouseCommand(), {
          intersectionId: message.intersectionId,
          playerId: client.sessionId
        })
      })
    })

    this.onMessage<Pick<PlaceInitialRoadCommand['payload'], 'edgeId'>>('place_road', (client, message) => {
      this.executeCommand(() => {
        this.dispatcher.dispatch(new PlaceInitialRoadCommand(), {
          ...message,
          playerId: client.sessionId
        })
      })
    })
  }

  executeCommand(execute: () => void) {
    execute()
  }

  async onJoin(client: Client, options: any) {
    const player = this.createPlayer(client.sessionId)
    this.state.players.set(player.id, player)

    if (this.state.players.size === this.options.numPlayers) {
      this.state.phase = GamePhases.Establishment
      this.state.phaseStep = PhaseSteps.PlaceInitialSettlement
      this.state.currentPlayer = Array.from(this.state.players.keys())[0]
      this.state.availableIntersections.push(...this.state.intersections.map((x) => x.id))
    }
  }

  createPlayer(id: string) {
    const player = new Player()
    player.id = id
    player.houses.push(
      ...Array.from({ length: this.options.numHouses }, (_, i) => i).map((i) =>
        new House().assign({
          id: `${id}-${i}`,
          owner: id
        })
      )
    )

    player.houses
    player.roads.push(
      ...Array.from({ length: this.options.numRoads }, (_, i) => i).map((i) =>
        new Road().assign({
          id: `${id}-${i}`,
          owner: id
        })
      )
    )

    return player
  }

  onLeave(client: Client, consented: boolean) {
    this.allowReconnection(client, 60)
    console.log(client.sessionId, 'left!')
  }
}
