import { Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { Point } from './Point'

export class Road extends Schema {
  @type('string') id: string
  @type('string') owner: string
  @type('string') edge: string

  private allPoints: Point[] = []

  static create(id: string, owner: string) {
    return new Road().assign({
      id,
      owner
    })
  }

  getEdge(state: GameState) {
    return state.edges.find((edge) => edge.id === this.edge)
  }

  getAllPoints(state: GameState) {
    // Cache the points after the first retrieval
    if (this.allPoints.length > 0) {
      return this.allPoints;
    }

    const edge = this.getEdge(state);
    if (!edge) {
      return [];
    }

    this.allPoints = edge.getAllPoints(state);
    return this.allPoints;
  }
}
