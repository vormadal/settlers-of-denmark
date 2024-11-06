import { ArraySchema, Schema, type } from '@colyseus/schema'
import { House } from './House'
import { Road } from './Road'
import { GameState } from './GameState'
import { Card } from './Card'

export class Player extends Schema {
  @type('string') id: string
  @type([House]) houses = new ArraySchema<House>()
  @type([Road]) roads = new ArraySchema<Road>()
  @type([Card]) cards = new ArraySchema<Card>()

  getAvailableHouses() {
    return this.houses.filter((house) => !house.intersection)
  }

  getAvailableRoads() {
    return this.roads.filter((road) => !road.edge)
  }

  getOccupiedIntersections(state: GameState) {
    return this.houses.filter((x) => !!x.intersection).map((house) => house.getIntersection(state))
  }
}
