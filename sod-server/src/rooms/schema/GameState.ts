import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { BorderEdge } from './BorderEdge'
import { Intersection } from './Intersection'
import { LandTiles } from './LandTile'
import { Player } from './Player'
import { Card } from './Card'
import { Die } from './Die'
import { HexProduction } from './HexProduction'

export class GameState extends Schema {
  @type([BorderEdge]) edges = new ArraySchema<BorderEdge>()
  @type([Intersection]) intersections = new ArraySchema<Intersection>()
  @type([LandTiles]) landTiles = new ArraySchema<LandTiles>()
  @type({ map: Player }) players = new MapSchema<Player>()

  @type([Card]) deck = new ArraySchema<Card>()

  @type('string') phase: string = GamePhases.WaitingForPlayers
  @type('string') currentPlayer: string = ''

  @type([HexProduction]) hexProductions = new ArraySchema<HexProduction>()
  @type('number') round = 1

  @type(['string']) availableIntersections = new ArraySchema<string>()
  @type(['string']) availableEdges = new ArraySchema<string>()

  @type([Die]) dice = new ArraySchema<Die>()

  updateAvailableIntersections() {
    this.availableIntersections.clear()
    const occupiedIntersections = [...this.players.values()]
      .map((x) => [
        ...x.settlements.map((settlement) => settlement.intersection)
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
