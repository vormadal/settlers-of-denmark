import { Player } from "./Player";
import { Structure } from "./Structure";
import { Road as Schema } from "../rooms/schema/Road";

export class Road extends Structure {
  constructor(id: string, owner: Player) {
    super(id, owner);
  }

  get state() {
    const schema = new Schema();
    schema.id = this.id;
    schema.owner = this.owner.id;
    return schema;
  }
}
