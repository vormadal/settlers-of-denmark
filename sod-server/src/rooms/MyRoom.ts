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
  debug?: boolean;
  numPlayers?: number;
  numSettlements?: number;
  numCities?: number;
  numRoads?: number;
  defaultExchangeRate?: number;
  // bank resource cards
  resourceCards?: {
    [key: string]: number;
  };
  // initial player resource cards (affects all players)
  initialPlayerResourceCards?: {
    [key: string]: number;
  };
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
      numRoads: 19,
      defaultExchangeRate: 4,
      resourceCards: {},
      initialPlayerResourceCards: options.debug
        ? {
            [CardVariants.Brick]: 5,
            [CardVariants.Grain]: 5,
            [CardVariants.Lumber]: 5,
            [CardVariants.Ore]: 5,
            [CardVariants.Wool]: 5,
          }
        : {},
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
    new HarborFactory().createHarbors(state);
    state.robberHex = state.hexes.find((x) => x.type === HexTypes.Desert).id;


    this.diceCup = new BaseGameDiceCup();

    this.diceCup.init(state);
    state.deck.push(
      ...cardGenerator(
        this.options.resourceCards?.[CardVariants.Brick] ?? 19,
        CardTypes.Resource,
        CardVariants.Brick,
        (card) => card
      ),
      ...cardGenerator(
        this.options.resourceCards?.[CardVariants.Grain] ?? 19,
        CardTypes.Resource,
        CardVariants.Grain,
        (card) => card
      ),
      ...cardGenerator(
        this.options.resourceCards?.[CardVariants.Lumber] ?? 19,
        CardTypes.Resource,
        CardVariants.Lumber,
        (card) => card
      ),
      ...cardGenerator(
        this.options.resourceCards?.[CardVariants.Ore] ?? 19,
        CardTypes.Resource,
        CardVariants.Ore,
        (card) => card
      ),
      ...cardGenerator(
        this.options.resourceCards?.[CardVariants.Wool] ?? 19,
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
      this.onMessage("startGame", (client, message) => {
        this.stateMachine.start();
        if (message?.autoPlace) {
          for (let i = 0; i < this.state.players.size * 2; i++) {
            const intersectionIndex =
              Math.floor(
                Math.random() *
                  this.state.availableSettlementIntersections.length
              ) - 1;
            this.stateMachine.send({
              type: "PLACE_SETTLEMENT",
              payload: {
                playerId: this.state.currentPlayer,
                intersectionId:
                  this.state.availableSettlementIntersections[
                    intersectionIndex
                  ],
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

  async onJoin(client: Client, options: RoomOptions) {
    const player = this.addPlayer(client.sessionId, options.name);
    console.log(client.sessionId, "joined!");

    if (options.debug) {
      for (let i = 1; i < this.options.numPlayers; i++) {
        this.addPlayer(client.sessionId, `Player ${i}`, `debug-${i}`);
      }
    }
    if (this.state.players.size >= this.options.numPlayers) {
      this.stateMachine.start();
    }
  }

  addPlayer(sessionId: string, name?: string, id?: string) {
    const player = new Player();
    player.id = id || sessionId;
    player.sessionId = sessionId;
    player.name = name || id;
    player.settlements.push(
      ...generate(this.options.numSettlements, (i) =>
        Settlement.create(`${player.id}-${i}`, player.id)
      )
    );
    player.cities.push(
      ...generate(this.options.numCities, (i) =>
        City.create(`${player.id}-${i}`, player.id)
      )
    );
    player.roads.push(
      ...generate(this.options.numRoads, (i) =>
        Road.create(`${player.id}-${i}`, player.id)
      )
    );
    Object.values(ResourceCardVariants).forEach((resource) =>
      player.exchangeRate.set(
        resource,
        ExchangeRate.create(resource, this.options.defaultExchangeRate)
      )
    );

    // Add initial player resource cards if specified
    if (this.options.initialPlayerResourceCards) {
      Object.entries(this.options.initialPlayerResourceCards).forEach(
        ([variant, count]) => {
          if (
            Object.values(ResourceCardVariants).includes(variant) &&
            count > 0
          ) {
            this.state.deck.push(
              ...cardGenerator(
                count,
                CardTypes.Resource,
                variant,
                (card) => (card.owner = player.id)
              )
            );
          }
        }
      );
    }

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
