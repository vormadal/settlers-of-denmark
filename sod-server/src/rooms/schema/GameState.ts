import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { BorderEdge } from './BorderEdge'
import { Card } from './Card'
import { Die } from './Die'
import { Hex } from './Hex'
import { HexProduction } from './HexProduction'
import { Intersection } from './Intersection'
import { Player } from './Player'
import { Road } from './Road'
import { Structure } from './Structure'
import { Harbor } from './Harbor'

export class GameState extends Schema {
  @type([BorderEdge]) edges = new ArraySchema<BorderEdge>()
  @type([Intersection]) intersections = new ArraySchema<Intersection>()
  @type([Hex]) hexes = new ArraySchema<Hex>()
  @type({ map: Player }) players = new MapSchema<Player>()
  @type([Harbor]) harbors = new ArraySchema<Harbor>()
  @type([Card]) deck = new ArraySchema<Card>()

  @type('string') phase: string = GamePhases.WaitingForPlayers
  @type('string') currentPlayer: string = ''

  @type([HexProduction]) hexProductions = new ArraySchema<HexProduction>()
  @type('number') round = 1
  @type('number') victoryPointsToWin: number = 10
  @type('boolean') isGameEnded: boolean = false

  @type(['string']) availableSettlementIntersections = new ArraySchema<string>()
  @type(['string']) availableCityIntersections = new ArraySchema<string>()
  @type(['string']) availableEdges = new ArraySchema<string>()
  @type(['string']) availableHexes = new ArraySchema<string>()
  @type(['string']) availablePlayersToSomethingFrom = new ArraySchema<string>()
  @type('string') robberHex: string = ''
  @type('boolean') canBuyDevelopmentCards: boolean = false
  @type('boolean') canPlayDevelopmentCards: boolean = false
  @type('string') hasLongestRoad: string = ''
  @type('string') hasLargestArmy: string = ''

  @type([Die]) dice = new ArraySchema<Die>()

  get playerList() {
    return [...this.players.values()]
  }

  get roads(): Road[] {
    return this.playerList.map((player) => player.roads.map((x) => x)).flat()
  }

  get structures(): Structure[] {
    return this.playerList.map((player) => player.structures).flat()
  }
  getOccupiedIntersections() {
    return this.structures.filter((x) => !!x.intersection).map((settlement) => settlement.getIntersection(this))
  }

  getAvailableCardsByType(cardType: string) {
    return this.deck.filter((card) => card.variant === cardType && !card.owner)
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
