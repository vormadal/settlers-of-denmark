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

  stateMachine = createBaseGameStateMachine(
    new GameMap("init", new BasicLayoutAlgorithm(3, 4)),
    new GameState()
  );

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

    this.stateMachine.subscribe((state) => {
      this.state.gameState = state.value.toString()
      console.log('state', state.value)
    });

    this.onMessage("*", (client, type, message) => {
      this.stateMachine.send({
        type: type as string,
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
