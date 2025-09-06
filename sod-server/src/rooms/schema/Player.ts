import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { City } from './City'
import { Road } from './Road'
import { Settlement } from './Settlement'
import { Structure } from './Structure'
import { GameState } from './GameState'
import { TradeRatio } from './TradeRatio'

export class Player extends Schema {
  @type('string') id: string
  @type('string') name: string
  @type('boolean') connected: boolean = true
  @type([Settlement]) settlements = new ArraySchema<Settlement>()
  @type([City]) cities = new ArraySchema<City>()
  @type([Road]) roads = new ArraySchema<Road>()
  @type({ map: TradeRatio }) initialResources = new MapSchema<TradeRatio>()

  get structures(): Structure[] {
    return [...this.settlements, ...this.cities]
  }

  getAvailableSettlements(): Settlement[] {
    return this.settlements.filter((settlement) => !settlement.intersection)
  }

  getAvailableCities() {
    return this.cities.filter((city) => !city.intersection)
  }

  getPlacedSettlements() {
    return this.settlements.filter((settlement) => !!settlement.intersection)
  }

  getPlacedCities() {
    return this.cities.filter((city) => !!city.intersection)
  }

  getPlacedStructures() {
    return this.structures.filter((structure) => !!structure.intersection)
  }

  getAvailableRoads() {
    return this.roads.filter((road) => !road.edge)
  }

  cards(state: GameState){
    return state.deck.filter((card) => card.owner === this.id)
  }

  cardsOfType(state: GameState, cardType: string){
    const cards = this.cards(state)
    return cards.filter((card) => card.variant === cardType)
  }

  getPorts(state: GameState) {
    const structureIntersections = this.getPlacedStructures().map((structure) => structure.intersection)
    return state.ports.filter((port) =>
      port.getIntersections(state).some((intersection) => structureIntersections.includes(intersection.id))
    )
  }

  getBankTradeRate(state: GameState, cardType: string) {
    const ports = this.getPorts(state)
    let ratio = 4 // default bank rate
    for(const port of ports){
      if(port.cardTypes.includes(cardType) && port.ratio < ratio){
        ratio = port.ratio
      }
    }

    return ratio
  }
}
