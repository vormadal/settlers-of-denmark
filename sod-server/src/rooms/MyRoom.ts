import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { LandTiles } from "../models/LandTiles";
import { Point } from "../models/Point";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    const state = new MyRoomState()


    const test = new LandTiles("string", "Dessert", new Point(100,100), [],[])


    state.LandTiles.push(test.getStateSchema())



    this.setState(state);


    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
