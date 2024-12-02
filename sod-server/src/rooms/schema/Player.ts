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

  cards(state: GameState){
    return state.deck.filter((card) => card.owner === this.id)
  }

  cardsOfType(state: GameState, cardType: string){
    const cards = this.cards(state)
    return cards.filter((card) => card.type === cardType)
  }

  cardsOfTypeWithAmount(state: GameState, cardType: string, amount: number){
    const cards = this.cardsOfType(state, cardType)
    const numberOfCards = cards.length

    if(numberOfCards < amount){
      return null
    }

    let cardsOut = []

    for (let index = 0; index < amount - 1; index++) {
      cardsOut.push(cards [index])
    }

    return cardsOut
  }
}
