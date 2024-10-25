import { BorderEdge } from '../../rooms/schema/BorderEdge'
import { GameState } from '../../rooms/schema/GameState'
import { Intersection } from '../../rooms/schema/Intersection'
import { LandTiles } from '../../rooms/schema/LandTile'
import { Point } from '../../rooms/schema/Point'
import { NumberProvider } from '../NumberProvider'
import { TileTypeProvider } from '../TileTypeProvider'
import { LayoutAlgorithm } from './LayoutAlgorithm'

export class BasicLayoutAlgorithm implements LayoutAlgorithm {
  state: GameState
  constructor(
    private readonly m: number,
    private readonly n: number,
    private readonly tileTypeProvider: TileTypeProvider,
    private readonly numberProvider: NumberProvider
  ) {}
  createLayout(state: GameState): GameState {
    this.state = state
    this.tileTypeProvider.init(2 * this.n * this.m)

    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const p1 = CalculatePoint(i, j)
        const p2 = CalculatePointAlt(i, j)

        const tile1 = this.createTile(p1, this.tileTypeProvider.nextType(), this.numberProvider.next())
        const tile2 = this.createTile(p2, this.tileTypeProvider.nextType(), this.numberProvider.next())

        this.state.landTiles.push(tile1, tile2)
      }
    }

    return state
  }

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
      pointA: copyPoint(intersectionA.position),
      pointB: copyPoint(intersectionB.position)
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
    const point = addPoints(
      position,
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

function addPoints(p1: Point, p2: Point) {
  return createPoint(p1.x + p2.x, p1.y + p2.y)
}

function CalculatePoint(m: number, n: number) {
  const x = 3 * m * 100
  const y = n * 100 * Math.sqrt(3)
  return createPoint(x, y)
}

function CalculatePointAlt(m: number, n: number) {
  const x = 3 * m * 100 + (3 * 100) / 2
  const y = (n * 100 + 0.5 * 100) * Math.sqrt(3)
  return createPoint(x, y)
}

function createPoint(x: number, y: number) {
  return new Point().assign({
    x,
    y
  })
}

function areEdgesEqual(edge1: BorderEdge, edge2: BorderEdge) {
  const ids = [edge1.pointA.id, edge1.pointB.id]
  const areEqual = ids.includes(edge2.pointA.id) && ids.includes(edge2.pointB.id)
  return areEqual
}

function copyPoint(point: Point) {
  return createPoint(point.x, point.y)
}
