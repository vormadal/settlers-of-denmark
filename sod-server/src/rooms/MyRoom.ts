import { Client, Deferred, Room } from "@colyseus/core";
import { BasicLayoutAlgorithm } from "../algorithms/layout/BasicLayoutAlgorithm";
import {
  PercentageTileTypeProvider,
  RandomTileTypeProvider,
} from "../algorithms/TileTypeProvider";
import { BaseGameTileTypes } from "../models/LandTiles";
import { GameState } from "./schema/GameState";
import { GameMap, GameMapOptions } from "../models/GameMap";
import { Dispatcher } from "@colyseus/command";
import { OnJoinCommand } from "../commands/OnJoinCommand";

export class MyRoom extends Room<GameState> {
  maxClients = 2;

  dispatcher = new Dispatcher(this);

  map: GameMap;
  
  onCreate(options: GameMapOptions) {
    this.map = new GameMap(
      `${Date.now()}`,
      new BasicLayoutAlgorithm(3, 4),
      options
    );

    this.setState(this.map.schema);

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  async onJoin(client: Client, options: any) {
    await this.dispatcher.dispatch(new OnJoinCommand(), {
      sessionId: client.sessionId,
    });
  }

  onLeave(client: Client, consented: boolean) {
    this.allowReconnection(client, 60);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
