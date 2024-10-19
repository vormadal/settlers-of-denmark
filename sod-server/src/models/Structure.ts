import { Player } from "./Player";

export class Structure {
  constructor(public readonly id: string, public readonly owner: Player) {}
}
