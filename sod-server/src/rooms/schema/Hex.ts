import { ArraySchema, Schema, type } from '@colyseus/schema'
import { Point } from './Point'
import { GameState } from './GameState'

export const HexTypes = {
  // base game
  Dessert: 'Dessert',
  Forest: 'Forest',
  Mountains: 'Mountains',
  Pastures: 'Pastures',
  Hills: 'Hills',
  Fields: 'Fields'
}

export class Hex extends Schema {
  @type(Point) position: Point
  @type('number') radius: number
  @type('string') id: string
  @type('string') type: string
  @type(['string']) edges = new ArraySchema<string>()
  @type(['string']) intersections = new ArraySchema<string>()
  @type('number') value?: number

  getIntersections(state: GameState) {
    return this.intersections.map((id) => state.intersections.find((x) => x.id === id))
  }

  // getStructures(state: GameState) {
  //   const intersections = this.getIntersections(state)
    
  //   return this.intersections.map((id) => state.players.get(state.intersections.find((x) => x.id === id)?.owner))
  // } 
}
