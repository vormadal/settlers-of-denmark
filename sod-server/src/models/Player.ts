import { Player as Schema } from "../rooms/schema/Player";
import { Road } from "./Road";
export class Player {
  roads: Road[] = [];
  constructor(public readonly id: string) {}

  get state() {
    const state = new Schema();
    state.id = this.id;
    return state;
  }
}
