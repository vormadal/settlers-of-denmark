import { Player } from "./Player";
import { Point } from "./Point";

export class Structure {
  public readonly position: Point;
  constructor(public readonly id: string, public readonly owner: Player) {}
}
