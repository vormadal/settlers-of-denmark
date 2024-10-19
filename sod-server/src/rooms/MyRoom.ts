import { Client, Room } from "@colyseus/core";
import { BasicLayoutAlgorithm } from "../algorithms/layout/BasicLayoutAlgorithm";
import {
  createBaseGameStateMachine,
  EVENT_NAMES,
} from "../baseGameStateMachine";
import { GameMap, GameMapOptions } from "../models/GameMap";
import { GameState } from "./schema/GameState";

export class MyRoom extends Room<GameState> {
  maxClients = 2;

  map: GameMap;

  stateMachine: any
  //  = createBaseGameStateMachine(
  //   new GameMap("init", new BasicLayoutAlgorithm(3, 4)),
  //   new GameState()
  // );

  onCreate(options: GameMapOptions) {
    this.map = new GameMap(
      `${Date.now()}`,
      new BasicLayoutAlgorithm(3, 4),
      options
    );

    this.maxClients = options.numPlayers;
    const state = this.map.schema;
    this.setState(state);
    this.stateMachine = createBaseGameStateMachine(this.map, state);

    this.onMessage(EVENT_NAMES.PLACE_HOUSE, (client, message) => {
      this.stateMachine.send({
        type: "PLACE_HOUSE",
        value: { sessionId: client.sessionId, ...message },
      });
    });
  
    // this.stateMachine.subscribe((state) => {
    //   state.context.gameState.gameState
    // });
  }

  async onJoin(client: Client, options: any) {
    this.stateMachine.send({
      type: "PLAYER_JOINED",
      value: { sessionId: client.sessionId },
    });
    this.stateMachine.send({ type: "START_GAME" });
  }

  onLeave(client: Client, consented: boolean) {
    this.allowReconnection(client, 60);
    console.log(client.sessionId, "left!");
  }
}
