import { Client, Room } from "@colyseus/core";
import { BasicLayoutAlgorithm } from "../algorithms/layout/BasicLayoutAlgorithm";
import {
  PercentageTileTypeProvider,
  RandomTileTypeProvider,
} from "../algorithms/TileTypeProvider";
import { BaseGameTileTypes } from "../models/LandTiles";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    const layout = new BasicLayoutAlgorithm(3, 4);
    // const map = layout.createLayout(
    //   new RandomTileTypeProvider(Object.keys(BaseGameTileTypes))
    // );

    const map = layout.createLayout(
      new PercentageTileTypeProvider({
        [BaseGameTileTypes.Dessert]: (1 / 19) * 100,
        [BaseGameTileTypes.Forrest]: (4 / 19) * 100,
        [BaseGameTileTypes.Grain]: (4 / 19) * 100,
        [BaseGameTileTypes.Lifestock]: (4 / 19) * 100,
        [BaseGameTileTypes.Mountains]: (3 / 19) * 100,
        [BaseGameTileTypes.Mine]: (3 / 19) * 100,
      })
    );
    this.setState(map.schema);

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
