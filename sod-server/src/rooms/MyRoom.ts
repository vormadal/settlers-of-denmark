import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { LandTiles } from "../models/LandTiles";
import { Point } from "../models/Point";
import { Intersection } from "../models/Intersection";
import { BoardGameMap } from "../models/BoardGameMap";





export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    const state = new MyRoomState()
    const boardGameMap = new BoardGameMap("test")
    const tiles = boardGameMap.landTiles
    const intersections = boardGameMap.intersections
    const edges = boardGameMap.borderEdges
    state.LandTiles.push(...tiles.map(x => x.getStateSchema()))
    state.intersections.push(...intersections.map(x => x.getStateSchema()))
    state.edges.push(...edges.map(x => x.getStateSchema()))


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
