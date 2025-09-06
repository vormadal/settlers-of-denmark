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
import { createBaseGameStateMachine } from "../stateMachines/BaseGameStateMachine";
import { generate } from "../utils/arrayHelpers";
import { Card, CardTypes, CardVariants } from "./schema/Card";
import { City } from "./schema/City";
import { HexTypes } from "./schema/Hex";
import { HexProduction } from "./schema/HexProduction";

function cardGenerator(
  count: number,
  type: string,
  variant: string,
  create: (card: Card) => void
): Card[] {
  return Array.from({ length: count }, (_, i) => i).map((i) => {
    const card = new Card();
    card.id = `${type}-${variant}-${i}`;
    card.type = type;
    card.variant = variant;
    create(card);
    return card;
  });
}

export interface RoomOptions {
  debug?: boolean;
  numPlayers?: number;
  numSettlements?: number;
  numCities?: number;
  numRoads?: number;

  name?: string; // player name
}

export class MyRoom extends Room<GameState> {
  maxClients = 2;
  options: RoomOptions;
  dispatcher = new Dispatcher(this);

  // dummy initialization to get the proper type
  stateMachine = createBaseGameStateMachine(this.state, this.dispatcher);
  diceCup: DiceCup;
  onCreate(options: RoomOptions) {
    this.options = {
      numCities: 4,
      numSettlements: 4,
      numPlayers: 2,
      numRoads: 9,
      ...options,
    };

    const state = new GameState();
    state.hexProductions.push(
      HexProduction.createResource(
        HexTypes.Fields,
        Settlement.Type,
        CardVariants.Grain
      ),
      HexProduction.createResource(
        HexTypes.Fields,
        City.Type,
        CardVariants.Grain,
        CardVariants.Grain
      ),
      HexProduction.createResource(
        HexTypes.Forest,
        Settlement.Type,
        CardVariants.Lumber
      ),
      HexProduction.createResource(
        HexTypes.Forest,
        City.Type,
        CardVariants.Lumber,
        CardVariants.Lumber
      ),
      HexProduction.createResource(
        HexTypes.Hills,
        Settlement.Type,
        CardVariants.Brick
      ),
      HexProduction.createResource(
        HexTypes.Hills,
        City.Type,
        CardVariants.Brick,
        CardVariants.Brick
      ),
      HexProduction.createResource(
        HexTypes.Mountains,
        Settlement.Type,
        CardVariants.Ore
      ),
      HexProduction.createResource(
        HexTypes.Mountains,
        City.Type,
        CardVariants.Ore,
        CardVariants.Ore
      ),
      HexProduction.createResource(
        HexTypes.Pastures,
        Settlement.Type,
        CardVariants.Wool
      ),
      HexProduction.createResource(
        HexTypes.Pastures,
        City.Type,
        CardVariants.Wool,
        CardVariants.Wool
      )
    );
    this.maxClients = this.options.numPlayers;

    const positions = new HexLayoutAlgorithm(3).createLayout();
    new HexFactory().createHexMap(state, positions);
    PercentageHexTypeProvider.default().assign(state);
    // new DebugNumberTokenProvider().assign(state)
    new DefaultNumberTokenProvider().assign(state);

    this.diceCup = new BaseGameDiceCup();

    this.diceCup.init(state);
    state.deck.push(
      ...cardGenerator(
        19,
        CardTypes.Resource,
        CardVariants.Brick,
        (card) => card
      ),
      ...cardGenerator(
        19,
        CardTypes.Resource,
        CardVariants.Grain,
        (card) => card
      ),
      ...cardGenerator(
        19,
        CardTypes.Resource,
        CardVariants.Lumber,
        (card) => card
      ),
      ...cardGenerator(
        19,
        CardTypes.Resource,
        CardVariants.Ore,
        (card) => card
      ),
      ...cardGenerator(
        19,
        CardTypes.Resource,
        CardVariants.Wool,
        (card) => card
      ),
      ...cardGenerator(
        14,
        CardTypes.Development,
        CardVariants.Knight,
        (card) => card
      ),
      ...cardGenerator(
        2,
        CardTypes.Development,
        CardVariants.Monopoly,
        (card) => card
      ),
      ...cardGenerator(
        2,
        CardTypes.Development,
        CardVariants.RoadBuilding,
        (card) => card
      ),
      ...cardGenerator(
        5,
        CardTypes.Development,
        CardVariants.VictoryPoint,
        (card) => card
      ),
      ...cardGenerator(
        2,
        CardTypes.Development,
        CardVariants.YearOfPlenty,
        (card) => card
      )
    );
    this.stateMachine = createBaseGameStateMachine(state, this.dispatcher);
    this.setState(state);

    if (this.options.debug) {
      for (let i = 0; i < this.options.numPlayers; i++) {
        const player = this.addPlayer(`debug-${i}`);
        player.cities[0].intersection = state.intersections[0].id;
        state.deck.push(
          ...cardGenerator(
            5,
            CardTypes.Resource,
            CardVariants.Brick,
            (card) => (card.owner = player.id)
          )
        ); // give each player some cards
        state.deck.push(
          ...cardGenerator(
            5,
            CardTypes.Resource,
            CardVariants.Grain,
            (card) => (card.owner = player.id)
          )
        );
        state.deck.push(
          ...cardGenerator(
            5,
            CardTypes.Resource,
            CardVariants.Lumber,
            (card) => (card.owner = player.id)
          )
        );
        state.deck.push(
          ...cardGenerator(
            5,
            CardTypes.Resource,
            CardVariants.Ore,
            (card) => (card.owner = player.id)
          )
        );
        state.deck.push(
          ...cardGenerator(
            5,
            CardTypes.Resource,
            CardVariants.Wool,
            (card) => (card.owner = player.id)
          )
        );
      }

      this.onMessage("startGame", (client, message) => {
        this.stateMachine.start();
        if (message?.autoPlace) {
          for (let i = 0; i < this.state.players.size * 2; i++) {
            const intersectionIndex =
              Math.floor(
                Math.random() * this.state.availableSettlementIntersections.length
              ) - 1;
            this.stateMachine.send({
              type: "PLACE_SETTLEMENT",
              payload: {
                playerId: this.state.currentPlayer,
                intersectionId:
                  this.state.availableSettlementIntersections[intersectionIndex],
              },
            });
            const edgeIndex =
              Math.floor(Math.random() * this.state.availableEdges.length) - 1;
            this.stateMachine.send({
              type: "PLACE_ROAD",
              payload: {
                playerId: this.state.currentPlayer,
                edgeId: this.state.availableEdges[edgeIndex],
              },
            });
          }
        }
      });
    }

    this.onMessage("*", (client, type, message) => {
      const payload = {
        ...message,
        // in debug we always act as the current player
        playerId: this.options.debug
          ? this.state.currentPlayer
          : client.sessionId,
      };
      console.log("received message:", type, payload);
      this.stateMachine.send({
        type: type,
        payload,
      } as any);
    });
  }

  executeCommand(execute: () => void) {
    execute();
  }

  async onJoin(client: Client, options: any) {
    const player = this.addPlayer(client.sessionId, options.name);
    console.log(client.sessionId, "joined!");
    if (this.state.players.size === this.options.numPlayers) {
      this.stateMachine.start();
    }
  }

  addPlayer(id: string, name?: string) {
    const player = new Player();
    player.id = id;
    player.name = name || id;
    player.settlements.push(
      ...generate(this.options.numSettlements, (i) =>
        Settlement.create(`${id}-${i}`, id)
      )
    );
    player.cities.push(
      ...generate(this.options.numCities, (i) => City.create(`${id}-${i}`, id))
    );
    player.roads.push(
      ...generate(this.options.numRoads, (i) => Road.create(`${id}-${i}`, id))
    );

    this.state.players.set(player.id, player);
    return player;
  }

  onLeave(client: Client, consented: boolean) {
    if (!consented) {
      this.allowReconnection(client, 600);
      console.log(client.sessionId, "left! Reconnection allowed for 1 hour.");
    }
    this.state.players.get(client.sessionId).connected = false;
    console.log(client.sessionId, "left!");
  }
}
