import { ArraySchema, Schema, type } from '@colyseus/schema'
import { Point } from './Point'
import { GameState } from './GameState'
import { BorderEdge } from './BorderEdge'
import { Intersection } from './Intersection'

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
  @type('string') id: string
  @type('string') type: string
  @type([Intersection]) intersections = new ArraySchema<Intersection>()
  @type('number') value?: number

  getPosition() {
    // Return the center position of the hex based on its intersections
    const [sx, sy] = this.intersections.reduce(
      ([x, y], intersection) => {
        return [x + intersection.position.x, y + intersection.position.y]
      },
      [0, 0]
    )
    const center = new Point().assign({ x: sx / this.intersections.length, y: sy / this.intersections.length })
    return center
  }
  getStructures(state: GameState) {
    const structures = []
    for (const intersection of this.intersections) {
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
