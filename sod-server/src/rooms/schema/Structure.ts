import { Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { Intersection } from './Intersection'
import { Road } from './Road'

export class Structure extends Schema {
  @type('string') id: string
  @type('string') type: string
  @type('string') owner: string
  @type('string') intersection?: string
  @type('int16') round?: number

  getIntersection(state: GameState): Intersection | undefined {
    return state.intersections.find((x) => x.id === this.intersection)
  }

  getRoads(state: GameState): Road[] {
    const edges = this.getIntersection(state)?.getEdges(state) ?? []
    return state.roads.filter((road) => road.owner === this.owner && edges.some((edge) => edge.id === road.edge))
  }

  getEdges(state: GameState) {
    return this.getIntersection(state)?.getEdges(state) ?? []
  }
}
