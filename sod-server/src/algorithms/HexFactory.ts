import { BorderEdge } from '../rooms/schema/BorderEdge'
import { GameState } from '../rooms/schema/GameState'
import { Intersection } from '../rooms/schema/Intersection'
import { Hex } from '../rooms/schema/Hex'
import { Vector } from '../utils/Vector'

export class HexFactory {
  intersections: Intersection[] = []
  edges: BorderEdge[] = []
  createHexMap = (gameState: GameState, positions: Vector[]) => {
    for (const position of positions) {
      const hex = this.createHex(position)
      gameState.hexes.push(hex)
    }
    gameState.intersections.clear()
    gameState.edges.clear()
    gameState.intersections.push(...this.intersections)
    gameState.edges.push(...this.edges)
  }

  createHex = (position: Vector) => {
    const hex = new Hex().assign({
      id: `hex:${position.x},${position.y}`,
      position: position.toPoint(),
      radius: 100
    })

    const intersections: Intersection[] = []
    for (let index = 0; index < 6; index++) {
      const angle = ((2 * Math.PI) / 6) * index
      const intersection = this.getOrCreateIntersection(position, angle)
      intersections.push(intersection)
    }

    hex.intersections.push(...intersections.map((x) => x.id))

    const edges: BorderEdge[] = []
    for (let index = 0; index < 6; index++) {
      const edge = this.getOrCreateEdge(intersections[(index + 1) % 6], intersections[index])
      edges.push(edge)
    }
    hex.edges.push(...edges.map((x) => x.id))
    return hex
  }

  getOrCreateEdge(intersectionA: Intersection, intersectionB: Intersection) {
    let edge = new BorderEdge().assign({
      id: `Edge:${intersectionA.id}->${intersectionB.id}`,
      pointA: intersectionA.position.copy(),
      pointB: intersectionB.position.copy()
    })

    const existing = this.edges.find((x) => areEdgesEqual(x, edge))
    if (existing) {
      edge = existing
    } else {
      this.edges.push(edge)
    }

    return edge
  }

  getOrCreateIntersection(position: Vector, angle: number) {
    const point = position.add(new Vector(Math.cos(angle), Math.sin(angle)).mul(100)).toPoint()

    let intersection = new Intersection().assign({
      id: `Intersection:${point.id}`,
      position: point
    })

    const existing = this.intersections.find((x) => x.id === intersection.id)
    if (existing) {
      intersection = existing
    } else {
      this.intersections.push(intersection)
    }

    return intersection
  }
}

function areEdgesEqual(edge1: BorderEdge, edge2: BorderEdge) {
  const ids = [edge1.pointA.id, edge1.pointB.id]
  const areEqual = ids.includes(edge2.pointA.id) && ids.includes(edge2.pointB.id)
  return areEqual
}
