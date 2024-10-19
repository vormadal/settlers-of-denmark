import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";
import { Point } from "./Point";
import { BorderEdge as Schema } from "../rooms/schema/BorderEdge";

export class BorderEdge {
  public readonly adjacentTiles: LandTiles[] = [];
  public readonly adjacentIntersections: Intersection[] = [];
  public readonly adjacentBorderEdges: BorderEdge[] = [];

  private readonly _schema: Schema;

  constructor(
    public readonly id: string,
    public readonly pointA: Point,
    public readonly pointB: Point
  ) {
    this._schema = new Schema();
    this._schema.id = id;
    this._schema.pointA = pointA.schema;
    this._schema.pointB = pointB.schema;
  }

  get schema() {
    return this._schema;
  }

  IsSameAs(borderEdge: BorderEdge) {
    const e1a = this.pointA;
    const e1b = this.pointB;
    const e2a = borderEdge.pointA;
    const e2b = borderEdge.pointB;

    if (e1a.IsTheSameAs(e2a) && e1b.IsTheSameAs(e2b)) {
      return true;
    } else if (e1a.IsTheSameAs(e2b) && e1b.IsTheSameAs(e2a)) {
      return true;
    }
    return false;
  }
}
