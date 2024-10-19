import { Player as Schema } from "../rooms/schema/Player";
import { House } from "./House";
import { Road } from "./Road";
export class Player {
  private _roads: Road[] = [];
  private _houses: House[] = [];
  private _schema: Schema;
  constructor(public readonly id: string) {
    this._schema = new Schema();
    this._schema.id = id;
  }

  set roads(value: Road[]) {
    this._roads = value;
    this._schema.roads.push(...value.map((x) => x.schema));
  }

  get roads() {
    return this._roads;
  }

  set houses(value: House[]) {
    this._houses = value;
    this._schema.houses.push(...value.map((x) => x.schema));
  }

  get houses() {
    return this._houses;
  }

  get schema() {
    return this._schema;
  }
}
