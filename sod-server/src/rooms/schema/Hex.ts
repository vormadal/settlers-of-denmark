import { ArraySchema, Schema, type } from '@colyseus/schema'
import { Point } from './Point'
import { GameState } from './GameState'

export const HexTypes = {
  // base game
  Desert: 'Desert',
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

  getStructures(state: GameState) {
    const intersections = this.getIntersections(state)
    
    const structures = []
    for (const intersection of intersections) {
      if (intersection) {
        const structure = state.structures.find((s) => s.intersection === intersection.id)
        if (structure) {
          structures.push(structure)
        }
      }
    }
    
    return structures
  } 
}
