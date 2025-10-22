import { Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { Point } from './Point'
import { Intersection } from './Intersection'

export class BorderEdge extends Schema {
  @type(Point) pointA: Point
  @type(Point) pointB: Point
  @type('string') id: string

  getIntersections(state: GameState) {
    return state.intersections.filter(
      (intersection) => intersection.position.id === this.pointA.id || intersection.position.id === this.pointB.id
    )
  }

  getAdjacentHexes(state: GameState) {
    return state.hexes.filter(
      (hex) =>
        hex.intersections.filter((intersection) => {
          return intersection.position.id === this.pointA.id || intersection.position.id === this.pointB.id
        }).length == 2 // both intersections of the edge are part of the hex
    )
  }

  getConnectedEdges(state: GameState, isPointABlocked: boolean = false, isPointBBlocked: boolean = false) {
    const availablePoints = [...(isPointABlocked ? [] : [this.pointA.id]), ...(isPointBBlocked ? [] : [this.pointB.id])]

    return state.edges.filter(
      (edge) => edge.id !== this.id && availablePoints.some((point) => [edge.pointA.id, edge.pointB.id].includes(point))
    )
  }

  getConnectedEdgesExcludingStructures(state: GameState, playerId: string) {
    const structurePointIds = state.structures
      .filter((structure) => structure.owner !== playerId && structure.intersection)
      .map((structure) => structure.intersection)
    const isPointABlocked = state.intersections.some((intersection) => {
      return intersection.position.id === this.pointA.id && structurePointIds.includes(intersection.id)
    })
    const isPointBBlocked = state.intersections.some((intersection) => {
      return intersection.position.id === this.pointB.id && structurePointIds.includes(intersection.id)
    })

    return this.getConnectedEdges(state, isPointABlocked, isPointBBlocked)
  }

  getAllPoints(state: GameState) {
    return [this.pointA, this.pointB]
  }

  static create(intersectionA: Intersection, intersectionB: Intersection) {
    return new BorderEdge().assign({
      id: `Edge:${intersectionA.id}->${intersectionB.id}`,
      pointA: intersectionA.position.copy(),
      pointB: intersectionB.position.copy()
    })
  }
}
