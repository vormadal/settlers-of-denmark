import { BorderEdge } from "../../models/BorderEdge";
import { GameMap } from "../../models/GameMap";
import { Intersection } from "../../models/Intersection";
import { LandTiles } from "../../models/LandTiles";
import { Point } from "../../models/Point";
import { TileTypeProvider } from "../TileTypeProvider";
import { LayoutAlgorithm } from "./LayoutAlgorithm";

export class BasicLayoutAlgorithm implements LayoutAlgorithm {
  private map: GameMap;
  constructor(private readonly m: number, private readonly n: number) {}
  createLayout(map: GameMap, tileTypeProvider: TileTypeProvider): GameMap {
    tileTypeProvider.setup(2 * this.n * this.m);
    this.map = map;

    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const p1 = CalculatePoint(i, j);
        const p2 = CalculatePointAlt(i, j);

        const tile1 = this.createTile(p1, tileTypeProvider.nextType());
        const tile2 = this.createTile(p2, tileTypeProvider.nextType());

        this.map.landTiles.push(tile1, tile2);
      }
    }

    return this.map;
  }

  createTile = (position: Point, type: string) => {
    const tile = new LandTiles(
      `tile:${position.x},${position.y}`,
      type,
      position
    );
    for (let index = 0; index < 6; index++) {
      const angle = ((2 * Math.PI) / 6) * index;
      const intersection = this.getOrCreateIntersection(position, angle);
      tile.intersections.push(intersection);
    }

    for (let index = 0; index < 6; index++) {
      const edge = this.getOrCreateEdge(
        tile.intersections[(index + 1) % 6],
        tile.intersections[index]
      );
      tile.edges.push(edge);
    }
    return tile;
  };

  getOrCreateEdge(intersectionA: Intersection, intersectionB: Intersection) {
    let edge = new BorderEdge(
      `Edge:${intersectionA.id},${intersectionB.id}`,
      intersectionA.position,
      intersectionB.position
    );

    const existing = this.map.borderEdges.find((x) => x.IsSameAs(edge));
    if (existing) {
      edge = existing;
    } else {
      this.map.borderEdges.push(edge);
    }

    return edge;
  }

  getOrCreateIntersection(position: Point, angle: number) {
    const point = new Point(Math.cos(angle), Math.sin(angle)).AddPoint(
      position
    );

    let intersection = new Intersection(
      `Intersection:${point.id}${angle}`,
      point
    );
    const existing = this.map.intersections.find(
      (x) => x.id === intersection.id
    );
    if (existing) {
      intersection = existing;
    } else {
      this.map.intersections.push(intersection);
    }

    return intersection;
  }
}
function CalculatePoint(m: number, n: number) {
  return new Point(3 * m, n * Math.sqrt(3));
}

function CalculatePointAlt(m: number, n: number) {
  return new Point(3 * m + 3 / 2, (n + 0.5) * Math.sqrt(3));
}
