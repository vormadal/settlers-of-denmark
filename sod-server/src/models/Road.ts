import { Player } from "./Player";
import { Structure } from "./Structure";
import { Road as Schema } from "../rooms/schema/Road";
import { BorderEdge } from "./BorderEdge";

export class Road extends Structure {
  private readonly _schema: Schema;
  private _edge: BorderEdge | null = null;

  constructor(id: string, owner: Player) {
    super(id, owner);
    this._schema = new Schema();
    this._schema.id = id;
    this._schema.owner = owner.id;
  }

  set edge(value: BorderEdge) {
    this._edge = value;
    this._schema.edge = value.id;
  }

  get edge() {
    return this._edge;
  }

  get schema() {
    return this._schema;
  }
}
