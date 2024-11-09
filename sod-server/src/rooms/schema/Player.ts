import { ArraySchema, Schema, type } from '@colyseus/schema'
import { Settlement } from './Settlement'
import { Road } from './Road'
import { GameState } from './GameState'
import { Card } from './Card'
import { City } from './City'

export class Player extends Schema {
  @type('string') id: string
  @type([Settlement]) settlements = new ArraySchema<Settlement>()
  @type([City]) cities = new ArraySchema<City>()
  @type([Road]) roads = new ArraySchema<Road>()
  @type([Card]) cards = new ArraySchema<Card>()

  getAvailableSettlements() {
    return this.settlements.filter((settlement) => !settlement.intersection)
  }

  getAvailableRoads() {
    return this.roads.filter((road) => !road.edge)
  }

  getOccupiedIntersections(state: GameState) {
    return this.settlements.filter((x) => !!x.intersection).map((settlement) => settlement.getIntersection(state))
  }
}
