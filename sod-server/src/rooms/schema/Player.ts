import { ArraySchema, Schema, type } from '@colyseus/schema'
import { City } from './City'
import { Road } from './Road'
import { Settlement } from './Settlement'
import { Structure } from './Structure'
import { GameState } from './GameState'

export class Player extends Schema {
  @type('string') id: string
  @type([Settlement]) settlements = new ArraySchema<Settlement>()
  @type([City]) cities = new ArraySchema<City>()
  @type([Road]) roads = new ArraySchema<Road>()

  get structures(): Structure[] {
    return [...this.settlements, ...this.cities]
  }

  getAvailableSettlements(): Settlement[] {
    return this.settlements.filter((structure) => !structure.intersection)
  }

  getAvailableRoads() {
    return this.roads.filter((road) => !road.edge)
  }

  cards(state: GameState) {
    const cards = state.deck.filter((card) => card.owner === this.id)
    return cards.reduce<{ [key: string]: number }>((acc, card) => {
      acc[card.variant] = acc[card.variant] ? acc[card.variant] + 1 : 1
      return acc
    }, {})
  }
}
