import { Dispatcher } from "@colyseus/command";
import { Client, Room } from "@colyseus/core";
import { PercentageHexTypeProvider } from "../algorithms/HexTypeProvider";
import { GameState } from "./schema/GameState";
import { Player } from "./schema/Player";
import { Road } from "./schema/Road";
import { Settlement } from "./schema/Settlement";

import { BaseGameDiceCup, DiceCup } from "../algorithms/DiceCup";
import { HexFactory } from "../algorithms/HexFactory";
import { HexLayoutAlgorithm } from "../algorithms/layout/HexLayoutAlgorithm";
import { DefaultNumberTokenProvider } from "../algorithms/NumberTokenProvider";
import { createBaseGameStateMachine } from "../games/base/BaseGameStateMachine";
import { generate } from "../utils/arrayHelpers";
import { CardTypes, CardVariants, ResourceCardVariants } from "./schema/Card";
import { City } from "./schema/City";
import { HexTypes } from "./schema/Hex";
import { HexProduction } from "./schema/HexProduction";
import { ExchangeRate } from "./schema/ExchangeRate";
import { HarborFactory } from "../algorithms/HarborFactory";
import { cardGenerator } from "../utils/cardGenerator";

export interface RoomOptions {
  mapSize?: number; // radius of hex map
  numRoads?: number;
}

export class DebugAlgorithmRoom extends Room<GameState> {
  maxClients = 1;
  options: RoomOptions;

  onCreate(options: RoomOptions) {
    this.options = {
      mapSize: 3,
      numRoads: 15,
      ...options,
    };

    const state = new GameState();
    state.maxPlayers = 0;
    const positions = new HexLayoutAlgorithm(
      this.options.mapSize
    ).createLayout();
    new HexFactory().createHexMap(state, positions);
    PercentageHexTypeProvider.default().assign(state);
    this.setState(state);
    const player = new Player();
    player.id = "debug";

    const longestPath = new Player();
    longestPath.id = "longest-path";    
    
    state.players.set(player.id, player);
    state.players.set(longestPath.id, longestPath);

    const edges = state.edges.map((x) => x.id);
    for (let i = 0; i < this.options.numRoads; i++) {
      const road = Road.create(`road-${i}`, player.id);
      const index = Math.floor(Math.random() * edges.length);
      road.edge = edges[index];
      edges.splice(index, 1);
      
      if(i < 5){
        longestPath.roads.push(road);
      }else{
        player.roads.push(road);
      }
    }

    this.onMessage("*", (client, type, message) => {
      console.log("received message:", type, message);
    });
  }
}
