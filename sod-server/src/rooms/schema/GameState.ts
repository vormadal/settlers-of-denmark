import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { BorderEdge } from './BorderEdge'
import { Intersection } from './Intersection'
import { LandTiles } from './LandTile'
import { Player } from './Player'

export class GameState extends Schema {
  @type([BorderEdge]) edges = new ArraySchema<BorderEdge>()
  @type([Intersection]) intersections = new ArraySchema<Intersection>()
  @type([LandTiles]) landTiles = new ArraySchema<LandTiles>()
  @type({ map: Player }) players = new MapSchema<Player>()

  @type('string') phase: string = GamePhases.WaitingForPlayers
  @type('string') phaseStep: string = PhaseSteps.PlaceInitialSettlement
  @type('string') currentPlayer: string = ''

  @type('number') round = 1

  @type(['string']) availableIntersections = new ArraySchema<string>()
  @type(['string']) availableEdges = new ArraySchema<string>()

  updateAvailableIntersections() {
    this.availableIntersections.clear()
    const occupiedIntersections = [...this.players.values()]
      .map((x) => [
        ...x.houses.map((house) => house.intersection)
        // ...x.cities.map(city => city.intersection)
      ])
      .flat()
      .filter((x) => x !== undefined)

    this.availableIntersections.push(
      ...this.intersections
        .filter((intersection) => !occupiedIntersections.includes(intersection.id))
        .map((intersection) => intersection.id)
    )
  }

  nextPlayer() {
    const playerIds = [...this.players.keys()]
    const currentPlayerIndex = playerIds.indexOf(this.currentPlayer)
    let nextPlayerIndex =
      this.round === 1 ? (currentPlayerIndex + 1) % playerIds.length : (currentPlayerIndex - 1) % playerIds.length

    if (this.phase === GamePhases.Establishment) {
      // this means the last player has placed their second initial settlement
      if (currentPlayerIndex < 0) {
        this.round++
        nextPlayerIndex = 0
        this.phase = GamePhases.InProgress
      }
    }

    this.currentPlayer = playerIds[nextPlayerIndex]
  }
}

export const PhaseSteps = {
  PlaceInitialSettlement: 'place_initial_settlement',
  PlaceInitialRoad: 'place_initial_road',
  PlaceSettlement: 'place_settlement',
  PlaceRoad: 'place_road',
  RollDice: 'roll_dice',
  Trade: 'trade',
  Build: 'build'
}

export const GamePhases = {
  WaitingForPlayers: 'waiting_for_players',
  Establishment: 'establishing_initial_settlements',
  InProgress: 'in_progress',
  Ended: 'ended'
}
