import { BorderEdge } from '../rooms/schema/BorderEdge'
import { GameState } from '../rooms/schema/GameState'
import { Intersection } from '../rooms/schema/Intersection'
import { Hex } from '../rooms/schema/Hex'
import { Vector } from '../utils/Vector'

export class HexFactory {
  intersections: Map<string, Intersection> = new Map()
  edges: Map<string, BorderEdge> = new Map()

  createHexMap = (gameState: GameState, positions: Vector[]) => {
    for (const position of positions) {
      const hex = this.createHex(position)
      gameState.hexes.push(hex)
    }
    gameState.intersections.clear()
    gameState.edges.clear()
    gameState.intersections.push(...this.intersections.values())
    gameState.edges.push(...this.edges.values())
  }

  createHex = (position: Vector) => {
    const hex = new Hex().assign({
      id: `hex:${position.x},${position.y}`
    })

    for (let index = 0; index < 6; index++) {
      const angle = ((2 * Math.PI) / 6) * index
      const intersection = this.createIntersection(position, angle)
      hex.intersections.push(intersection)
    }
    

    for (let index = 0; index < 6; index++) {
      this.getOrCreateEdge(hex.intersections[(index + 1) % 6], hex.intersections[index])
    }
    return hex
  }

  getOrCreateEdge(intersectionA: Intersection, intersectionB: Intersection) {
    let edge = new BorderEdge().assign({
      id: `Edge:${intersectionA.id}->${intersectionB.id}`,
      pointA: intersectionA.position.copy(),
      pointB: intersectionB.position.copy()
    })

    this.edges.set(edge.id, edge)
    return edge
  }

  createIntersection(position: Vector, angle: number) {
    const point = position.add(new Vector(Math.cos(angle), Math.sin(angle)).mul(100)).toPoint()

    let intersection = new Intersection().assign({
      id: `Intersection:${point.id}`,
      position: point
    })

    this.intersections.set(intersection.id, intersection)
    return intersection
  }
}

