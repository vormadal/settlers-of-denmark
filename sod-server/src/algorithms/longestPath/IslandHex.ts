import { Hex } from "../../rooms/schema/Hex";

export class IslandHex {
  public islandId: number | null = null;


  get id() {
    return this.hex?.id ?? "ocean";
  }

  constructor(public readonly hex: Hex | null) {}
}
