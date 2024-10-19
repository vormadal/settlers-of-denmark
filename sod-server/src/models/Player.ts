import { Player as State } from "../rooms/schema/MyRoomState";
export class Player {
  constructor(public readonly id: string) {}

  get state() {
    const state = new State();
    state.id = this.id;
    return state;
  }
}
