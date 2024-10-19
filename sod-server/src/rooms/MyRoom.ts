import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { LandTiles } from "../models/LandTiles";
import { Point } from "../models/Point";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    const state = new MyRoomState();

    const size = 10
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = new LandTiles(
          `${i},${j}`,
          "Dessert",
          new Point(100 * i, 100 * j),
          [],
          []
        );
        state.LandTiles.push(tile.getStateSchema());
      }
    }

    this.setState(state);

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
