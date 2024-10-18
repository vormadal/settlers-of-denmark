import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { LandTiles } from "../models/LandTiles";
import { Point } from "../models/Point";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    const state = new MyRoomState()

    const maxValueX = 3;
    const maxValueY = 6;

    var allThemLandTiles = []


    for (let i = 0; i < maxValueX; i++) {
      for (let j = 0; j < maxValueY; j++) {

        allThemLandTiles.push(new LandTiles(`x${i} y${j}`, "Dessert", new Point(3 * i*60, j*60 * Math.sqrt(3)), [], []).getStateSchema())
        allThemLandTiles.push(new LandTiles(`fx${i} y${j}`, "Dessert", new Point(3 * i * 60 + (3 / 2)*60, (j + 0.5) * 60 * Math.sqrt(3)), [], []).getStateSchema())
      }
    }

    state.LandTiles.push(...allThemLandTiles)



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
