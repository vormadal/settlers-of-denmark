import { createMachine, assign, createActor, setup } from "xstate";
import { GameState, GameStates } from "./rooms/schema/GameState";
import { GameMap } from "./models/GameMap";

export const EVENT_NAMES = {
  PLAYER_JOINED: "PLAYER_JOINED",
  START_GAME: "START_GAME",
  PLACE_HOUSE: "PLACE_HOUSE",
  PLACE_CITY: "PLACE_CITY",
  PLACE_ROAD: "PLACE_ROAD",
  ROLL_DICE: "ROLL_DICE",
  TRADE: "TRADE",
  END_TURN: "END_TURN",
};

type AddPlayerEvent = {
  type: typeof EVENT_NAMES.PLAYER_JOINED;
  value: {
    sessionId: string;
  };
};

type StartGameEvent = {
  type: typeof EVENT_NAMES.START_GAME;
};

type PlaceHouseEvent = {
  type: typeof EVENT_NAMES.PLACE_HOUSE;
  value: {
    sessionId: string;
    intersectionId: string;
  };
};

type placeCityEvent = {
  type: typeof EVENT_NAMES.PLACE_CITY;
  value: {
    sessionId: string;
    intersectionId: string;
  };
};

type placeRoadEvent = {
  type: typeof EVENT_NAMES.PLACE_ROAD;
  value: {
    sessionId: string;
    edgeId: string;
  };
};

export function createBaseGameStateMachine(game: GameMap, schema: GameState) {
  const baseGameStateMachine = setup({
    types: {
      context: {} as {
        gameState: GameState;
        game: GameMap;
      },
      events: {} as
        | AddPlayerEvent
        | StartGameEvent
        | PlaceHouseEvent
        | placeCityEvent
        | placeRoadEvent,
    },
    guards: {
      isGameReady: ({ context }) => {
        console.log(
          "isGameReady",
          context.game.options.numPlayers,
          context.gameState.players.size
        );
        return (
          context.game.options.numPlayers == context.gameState.players.size
        );
      },
    },
    actions: {
      startGame: assign({
        gameState: ({ context }) => {
          context.gameState.gameState = GameStates.InProgress;
          const players = context.gameState.players;
          const id = players.keys().next().value;
          context.gameState.currentPlayer = id;
          return context.gameState;
        },
      }),
      addPlayer: assign({
        gameState: ({ context, event }) => {
          const e = event as AddPlayerEvent;
          const player = context.game.addPlayer(e.value.sessionId);
          context.gameState.players.set(player.id, player.schema);

          // if (context.game.options.numPlayers == context.gameState.players.size) {
          //   this.state.gameState = GameStates.InProgress;
          // }
          return context.gameState;
        },
      }),
      placeHouse: assign({
        gameState: ({ context, event }) => {
          const e = event as PlaceHouseEvent;
          console.log("placeHouse", e.value);
          const player = context.game.players.find(
            (x) => x.id == e.value.sessionId
          );
          const intersection = context.game.intersections.find(
            (x) => x.id == e.value.intersectionId
          );
          const house = player.houses.find((x) => !x.intersection);
          house.intersection = intersection;

          console.log('placing house', intersection)
          return context.gameState;
        },
      }),
    },
  }).createMachine({
    initial: "lobby",
    context: {
      game: game,
      gameState: schema,
    },
    states: {
      lobby: {
        on: {
          PLAYER_JOINED: {
            reenter: true,
            actions: "addPlayer",
          },
          START_GAME: {
            target: "establishing",
            guard: "isGameReady",
            actions: "startGame",
          },
        },
      },
      establishing: {
        on: {
          PLACE_HOUSE: {
            actions: "placeHouse",
          },
          // PLACE_CITY: {
          //   actions: "placeCity",
          // },
          // PLACE_ROAD: {
          //   actions: "placeRoad",
          // },
          // ROLL_DICE: {
          //   actions: "rollDice",
          // },
          // TRADE: {
          //   actions: "trade",
          // },
          // END_TURN: {
          //   actions: "endTurn",
          // },
        },
      },
    },
  });

  const actor = createActor(baseGameStateMachine).start();

  return actor;
}
// actor.send({ type: "PLAYER_JOINED", value: { sessionId: "123" } });

// countActor.subscribe((state) => {
//   console.log(state.context.count);
// });

// countActor.send({ type: "INC" });
// // logs 1
// countActor.send({ type: "DEC" });
// // logs 0
// countActor.send({ type: "SET", value: 10 });
