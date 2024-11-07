import { BorderEdge } from '../../rooms/schema/BorderEdge'
import { GameState } from '../../rooms/schema/GameState'
import { Intersection } from '../../rooms/schema/Intersection'
import { LandTiles } from '../../rooms/schema/LandTile'
import { Point } from '../../rooms/schema/Point'
import { NumberProvider } from '../NumberProvider'
import { TileTypeProvider } from '../TileTypeProvider'

export abstract class LayoutAlgorithm {
  state: GameState
  abstract createLayout(state: GameState): GameState

  createTile = (position: Point, type: string, number: number) => {
    const tile = new LandTiles().assign({
      id: `tile:${position.x},${position.y}`,
      type,
      position,
      value: number,
      radius: 100
    })

    const intersections: Intersection[] = []
    for (let index = 0; index < 6; index++) {
      const angle = ((2 * Math.PI) / 6) * index
      const intersection = this.getOrCreateIntersection(position, angle)
      intersections.push(intersection)
    }

    tile.intersections.push(...intersections.map((x) => x.id))

    const edges: BorderEdge[] = []
    for (let index = 0; index < 6; index++) {
      const edge = this.getOrCreateEdge(intersections[(index + 1) % 6], intersections[index])
      edges.push(edge)
    }
    tile.edges.push(...edges.map((x) => x.id))
    return tile
  }

  getOrCreateEdge(intersectionA: Intersection, intersectionB: Intersection) {
    let edge = new BorderEdge().assign({
      id: `Edge:${intersectionA.id}->${intersectionB.id}`,
      pointA: intersectionA.position.copy(),
      pointB: intersectionB.position.copy()
    })

    const existing = this.state.edges.find((x) => areEdgesEqual(x, edge))
    if (existing) {
      edge = existing
    } else {
      this.state.edges.push(edge)
    }

    return edge
  }

  getOrCreateIntersection(position: Point, angle: number) {
    const point = position.add(
      new Point().assign({
        x: Math.cos(angle) * 100,
        y: Math.sin(angle) * 100
      })
    )

    let intersection = new Intersection().assign({
      id: `Intersection:${point.id}`,
      position: point
    })

    const existing = this.state.intersections.find((x) => x.id === intersection.id)
    if (existing) {
      intersection = existing
    } else {
      this.state.intersections.push(intersection)
    }

    return intersection
  }
}

function areEdgesEqual(edge1: BorderEdge, edge2: BorderEdge) {
  const ids = [edge1.pointA.id, edge1.pointB.id]
  const areEqual = ids.includes(edge2.pointA.id) && ids.includes(edge2.pointB.id)
  return areEqual
}
