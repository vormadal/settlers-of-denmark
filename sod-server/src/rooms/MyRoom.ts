import { Dispatcher } from '@colyseus/command'
import { Client, Room } from '@colyseus/core'
import { BasicLayoutAlgorithm } from '../algorithms/layout/BasicLayoutAlgorithm'
import { PercentageTileTypeProvider } from '../algorithms/TileTypeProvider'
import { PlaceSettlementCommand } from '../commands/base/PlaceSettlementCommand'
import { PlaceRoadCommand } from '../commands/base/PlaceRoadCommand'
import { GamePhases, GameState, PhaseSteps } from './schema/GameState'
import { Settlement as Settlement } from './schema/Settlement'
import { Player } from './schema/Player'
import { Road } from './schema/Road'

import { BalancedNumberProvider, DebugNumberProvider, RandomNumberProvider } from '../algorithms/NumberProvider'
import { BaseGameTileTypes } from './schema/LandTile'
import { createBaseGameStateMachine } from '../stateMachines/BaseGameStateMachine'
import { Card, CardTypes, CardVariants } from './schema/Card'
import { HexLayoutAlgorithm } from '../algorithms/layout/HexLayoutAlgorithm'
import { generate } from '../utils/arrayHelpers'
import { City } from './schema/City'

function cardGenerator(count: number, type: string, variant: string, create: (card: Card) => Card) {
  return Array.from({ length: count }, (_, i) => i).map((i) => {
    const card = new Card()
    card.id = `${type}-${variant}-${i}`
    card.type = type
    card.variant = variant
    return create(card)
  })
}

export interface GameMapOptions {
  numPlayers: number
  numSettlements: number
  numCities: number
  numRoads: number
}

export class MyRoom extends Room<GameState> {
  maxClients = 2
  options: GameMapOptions
  dispatcher = new Dispatcher(this)

  // dummy initialization to get the proper type
  stateMachine = createBaseGameStateMachine(this.state, this.dispatcher)

  onCreate(options: GameMapOptions) {
    this.options = {
      numCities: 4,
      numSettlements: 4,
      numPlayers: 2,
      numRoads: 9,
      ...options
    }

    this.maxClients = options.numPlayers
    const tileTypeProvider = new PercentageTileTypeProvider({
      [BaseGameTileTypes.Dessert]: (1 / 19) * 100,
      [BaseGameTileTypes.Forest]: (4 / 19) * 100,
      [BaseGameTileTypes.Fields]: (4 / 19) * 100,
      [BaseGameTileTypes.Pastures]: (4 / 19) * 100,
      [BaseGameTileTypes.Mountains]: (3 / 19) * 100,
      [BaseGameTileTypes.Hills]: (3 / 19) * 100
    })
    const numberProvider = new DebugNumberProvider()
    // const layoutAlgorithm = new BasicLayoutAlgorithm(3, 4, tileTypeProvider, numberProvider)
    const layoutAlgorithm = new HexLayoutAlgorithm(4, tileTypeProvider, numberProvider)
    const state = layoutAlgorithm.createLayout(new GameState())
    state.deck.push(
      ...cardGenerator(14, CardTypes.Resource, CardVariants.Brick, (card) => card),
      ...cardGenerator(14, CardTypes.Resource, CardVariants.Grain, (card) => card),
      ...cardGenerator(14, CardTypes.Resource, CardVariants.Lumber, (card) => card),
      ...cardGenerator(14, CardTypes.Resource, CardVariants.Ore, (card) => card),
      ...cardGenerator(14, CardTypes.Resource, CardVariants.Wool, (card) => card),
      ...cardGenerator(5, CardTypes.Development, CardVariants.Knight, (card) => card),
      ...cardGenerator(2, CardTypes.Development, CardVariants.Monopoly, (card) => card),
      ...cardGenerator(2, CardTypes.Development, CardVariants.RoadBuilding, (card) => card),
      ...cardGenerator(2, CardTypes.Development, CardVariants.VictoryPoint, (card) => card),
      ...cardGenerator(2, CardTypes.Development, CardVariants.YearOfPlenty, (card) => card)
    )
    this.stateMachine = createBaseGameStateMachine(state, this.dispatcher)
    this.setState(state)

    this.onMessage('*', (client, type, message) => {
      console.log('received message:', type, message)
      if (this.state.currentPlayer !== client.sessionId) {
        //TODO this might not always be the case
        return
      }
      this.stateMachine.send({
        type: type,
        payload: {
          ...message,
          playerId: client.sessionId
        }
      } as any)
    })

    // this.onMessage<Pick<PlaceHouseCommand['payload'], 'intersectionId'>>('place_house', (client, message) => {
    //   this.executeCommand(() => {
    //     this.dispatcher.dispatch(new PlaceHouseCommand(), {
    //       intersectionId: message.intersectionId,
    //       playerId: client.sessionId
    //     })
    //   })
    // })

    // this.onMessage<Pick<PlaceRoadCommand['payload'], 'edgeId'>>('place_road', (client, message) => {
    //   this.executeCommand(() => {
    //     this.dispatcher.dispatch(new PlaceRoadCommand(), {
    //       ...message,
    //       playerId: client.sessionId
    //     })
    //   })
    // })
  }

  executeCommand(execute: () => void) {
    execute()
  }

  async onJoin(client: Client, options: any) {
    const player = this.createPlayer(client.sessionId)
    this.state.players.set(player.id, player)

    if (this.state.players.size === this.options.numPlayers) {
      this.stateMachine.start()
      // this.state.phase = GamePhases.Establishment
      // this.state.phaseStep = PhaseSteps.PlaceInitialSettlement
      // this.state.currentPlayer = Array.from(this.state.players.keys())[0]
      // this.state.availableIntersections.push(...this.state.intersections.map((x) => x.id))
    }
  }

  createPlayer(id: string) {
    const player = new Player()
    player.id = id
    player.settlements.push(
      ...generate(this.options.numSettlements, (i) => new Settlement().assign({ id: `${id}-${i}`, owner: id }))
    )
    player.cities.push(...generate(this.options.numCities, (i) => new City().assign({ id: `${id}-${i}`, owner: id })))
    player.roads.push(...generate(this.options.numRoads, (i) => new Road().assign({ id: `${id}-${i}`, owner: id })))

    return player
  }

  onLeave(client: Client, consented: boolean) {
    this.allowReconnection(client, 60)
    console.log(client.sessionId, 'left!')
  }
}
