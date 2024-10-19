import { House as Schema } from "../rooms/schema/House";
import { Intersection } from "./Intersection";
import { Player } from "./Player";
import { Structure } from "./Structure";

export class House extends Structure {
  private readonly _schema;
  constructor(id: string, owner: Player) {
    super(id, owner);
    this._schema = new Schema();
    this._schema.id = id;
    this._schema.owner = owner.id;
  }

  private _intersection?: Intersection;

  get intersection() {
    return this._intersection;
  }

  set intersection(value: Intersection | null) {
    this._intersection = value;
    this._schema.intersection = value ? value.id : null;
  }

  get schema() {
    return this._schema;
  }
}
