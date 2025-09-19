import { Dispatcher } from "@colyseus/command";
import { createActor, setup } from "xstate";
import { MyRoom } from "../../rooms/MyRoom";
import { GameState } from "../../rooms/schema/GameState";
import {
  buyRoad,
  buySettlement,
  buyCity,
  clearAvailableEdges,
  clearAvailableSettlementIntersections,
  clearAvailableCityIntersections,
  nextPlayer,
  placeRoad,
  placeSettlement,
  produceInitialResources,
  produceResources,
  rollDice,
  setAvailableEdges,
  setAvailableSettlementIntersections,
  setAvailableCityIntersections,
  bankTrade,
  updatePlayerExchangeRate,
  updatePlayerVictoryPoints,
  gameEnded,
  updatePlayerLongestRoad,
  updateLongestRoadAfterSettlmentPlacement
} from "./actions";
import { Events } from "./events";
import {
  guard,
  initialRoundIsComplete,
  isGameEnded,
  isPlayerTurn,
} from "./guards/base";

export type InputType = {
  event: Events;
  context: {
    gameState: GameState;
    dispatcher: Dispatcher<MyRoom>;
  };
};

const machineConfig = setup({
  types: {
    context: {} as InputType["context"],
    events: {} as InputType["event"],
  },
  actions: {
    placeSettlement,
    buySettlement,
    buyCity,
    placeRoad,
    buyRoad,
    nextPlayer,
    setAvailableSettlementIntersections,
    setAvailableCityIntersections,
    setAvailableEdges,
    clearAvailableEdges,
    clearAvailableSettlementIntersections,
    clearAvailableCityIntersections,
    rollDice,
    produceInitialResources,
    produceResources,
    bankTrade,
    updatePlayerExchangeRate,
    updatePlayerVictoryPoints,
    gameEnded,
    updatePlayerLongestRoad,
    updateLongestRoadAfterSettlmentPlacement
  },
  guards: {
    initialRoundIsComplete: guard(initialRoundIsComplete, isPlayerTurn),
    isPlayerTurn,
    isGameEnded,
  },
});

export function createBaseGameStateMachine(
  gameState: GameState,
  dispatcher: Dispatcher<MyRoom>
) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IATAFYAHCTtW7agJwBGOwDYA7AGYPdxsAGhAAT0QAFjUHVzUvdy8XNT8bBJsAXwzQtCw8QlJKanwoACVddAgeARFRUoB5fgARdS0kED0DIxMzSwQ7OJJ3aMjXH2cUyLsfUIiEPwHHK2dXSJ9XW3ifLyycjBwCYnIqTBpyyuqhMQbmlXc2nX1DY1N2vr8fB3cPn0j3Vz8kS8Gxm4WskUiJC8wKsnjUPiCYysuxAuQOBRIACddBQKDQmrhMGBOA1eLxRE0AJIiVpmTrPHpvRDfHxqEiuDnTLxWeI2KxjWZRKxednxZYeaG+VYotH5I4MACumPwnCUTVEkgAqqVFLT2vTuq9QH1vi4SAjpjY+e51pE-FZBQhbA4efzXHYfvZEplsqj9nLSIrlZdajcWpo6U9Db1rLySJF+V4PkC1DZfqC5sMbCQbIDIny0s5hcKZf7DoGlSq+FdxFIZPIlKoI-qoy8Y06UiKETFpim0yEwQgALSJSF8+2fYU+BFeVOlvLlkhBqs1MSCSmSACaeseXTbTI7wKGNpZffTjuGJFSAOW3PcnmnEPn6Pllc4ACF+IoANIa0rNYQdw6VtGWNWMvGzIFewRBZc2GR0rHWRxRgCWEfCtdxhR2X1ZUXHAwEwABrGhhHwKogINfcwKdIF3BIWFZ2WFJ3W5OxHSHKw-DZSUeN4pNnwDEh8KIkiyM4O4HmAvdQIsZl1m4vjeIzRA+RzbkIW2WEH1+SIsl9fBdAgOAzFwgpI2ko1ZOHb4vHY1Cr3hZM0i4tMBMXIpThKegmBYNgOHMhlLL6IdpnZDlwoiiKEPteME1nNM-BPPw3IxDyzgqCAAujA8ILogZU2iCdp1+R0Flcc1tjUTi1iTRLdJwssMWxXF8UJMAsqoqzMOidkPj8AJbQ9WxHTi+jKrUTwpkKn09gXDFlw6mSTS8P52UTZN4vQ0rfivGwb2Le9pl+FKjmE4iSlIzKWws9sGLUOy1EhFx-F+ZzUx8E7SHYIyrt3QLbqSHx6IHTN+vohM9qBVD3R9LIgA */
    context: { gameState: gameState, dispatcher: dispatcher },
    initial: "placingSettlement",
    states: {
      placingSettlement: {
        entry: ["nextPlayer", "setAvailableSettlementIntersections"],
        exit: ["clearAvailableSettlementIntersections"],
        on: {
          PLACE_SETTLEMENT: {
            target: "placingRoad",
            actions: [
              "placeSettlement",
              "produceInitialResources",
              "updatePlayerExchangeRate",
              "updatePlayerVictoryPoints",
            ],
            guard: "isPlayerTurn",
          },
        },
      },
      placingRoad: {
        entry: ["setAvailableEdges"],
        exit: ["clearAvailableEdges"],
        on: {
          PLACE_ROAD: [
            {
              target: "rollingDice",
              actions: ["placeRoad", "nextPlayer", 'updatePlayerLongestRoad'],
              guard: "initialRoundIsComplete",
            },
            {
              target: "placingSettlement",
              actions: ["placeRoad", 'updatePlayerLongestRoad'],
              guard: "isPlayerTurn",
            },
          ],
        },
      },
      rollingDice: {
        on: {
          ROLL_DICE: {
            target: "turn",
            actions: ["rollDice", "produceResources"],
            guard: "isPlayerTurn",
          },
        },
      },
      turn: {
        entry: [
          "setAvailableSettlementIntersections",
          "setAvailableCityIntersections",
          "setAvailableEdges",
        ],
        exit: [
          "clearAvailableSettlementIntersections",
          "clearAvailableCityIntersections",
          "clearAvailableEdges",
        ],
        on: {
          END_TURN: {
            target: "rollingDice",
            actions: "nextPlayer",
            guard: "isPlayerTurn",
          },
          PLACE_ROAD: {
            target: "turn",
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: ["buyRoad", 'updatePlayerLongestRoad'],
            guard: "isPlayerTurn",
          },
          // Settlement / City purchases now always go through 'checkingEnd'
          // so that victory points are updated before evaluating game end.
          PLACE_SETTLEMENT: {
            target: "checkingEnd",
            actions: [
              "buySettlement",
              "updatePlayerExchangeRate",
              "updatePlayerVictoryPoints",
            , 'updateLongestRoadAfterSettlmentPlacement'],
            guard: "isPlayerTurn",
          },
          PLACE_CITY: {
            target: "checkingEnd",
            actions: ["buyCity", "updatePlayerVictoryPoints"],
            guard: "isPlayerTurn",
          },
          BANK_TRADE: {
            target: "turn",
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: "bankTrade",
            guard: "isPlayerTurn",
          },
        },
      },
      checkingEnd: {
        always: [{ guard: "isGameEnded", target: "ended" }, { target: "turn" }],
      },
      ended: {
        entry: ["gameEnded"],
      },
    },
  });
  const actor = createActor(machine);
  actor.subscribe((state) => {
    gameState.phase = state.value as string;
  });

  return actor;
}
