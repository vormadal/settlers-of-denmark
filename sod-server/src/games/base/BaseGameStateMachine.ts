import { Dispatcher } from "@colyseus/command";
import { createActor, setup } from "xstate";
import { MyRoom } from "../../rooms/MyRoom";
import { GameState } from "../../rooms/schema/GameState";
import {
  buyRoad,
  buySettlement,
  buyCity,
  buyDevelopmentCard,
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
  updateLongestRoadAfterSettlementPlacement,
  setCanBuyDevelopmentCards,
  clearCanBuyDevelopmentCards,
  playKnightDevelopmentCard,
  updateLargestArmy,
  setAvailableHexesForRobber,
  clearAvailableHexes,
  moveRobber,
  stealResource,
  setAvailablePlayersToStealFrom,
  clearAvailablePlayersToSomethingFrom,
  setCanPlayDevelopmentCards,
  clearCanPlayDevelopmentCards,
  increaseNumberOfDevelopmentCardsPlayed,
  clearNumberOfDevelopmentCardsPlayed,
  monopolizeResource,
  setAvailablePlayersToMonopolyzeFrom,
  playMonopolyDevelopmentCard,
  playYearOfPlentyDevelopmentCard,
  getYearOfPlentyResources,
  increaseRoadBuildingPhase,
  clearRoadBuildingPhase,
  playRoadBuildingDevelopmentCard
} from "./actions";
import { Events } from "./events";
import {
  guard,
  initialRoundIsComplete,
  isGameEnded,
  isPlayerTurn,
  isKnightPlayed,
  isMonopolyPlayed,
  isRoadBuildingPlayed,
  isYearOfPlentyPlayed,
  roadBuildingComplete
} from "./guards";

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
    buyDevelopmentCard,
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
    updateLongestRoadAfterSettlementPlacement,
    setCanBuyDevelopmentCards,
    clearCanBuyDevelopmentCards,
    playKnightDevelopmentCard,
    updateLargestArmy,
    setAvailableHexesForRobber,
    clearAvailableHexes,
    moveRobber,
    stealResource,
    setAvailablePlayersToStealFrom,
    clearAvailablePlayersToSomethingFrom,
    setCanPlayDevelopmentCards,
    clearCanPlayDevelopmentCards,
    increaseNumberOfDevelopmentCardsPlayed,
    clearNumberOfDevelopmentCardsPlayed,
    monopolizeResource,
    setAvailablePlayersToMonopolyzeFrom,
    playMonopolyDevelopmentCard,
    playYearOfPlentyDevelopmentCard,
    getYearOfPlentyResources,
    increaseRoadBuildingPhase,
    clearRoadBuildingPhase,
    playRoadBuildingDevelopmentCard
  },
  guards: {
    initialRoundIsComplete: guard(initialRoundIsComplete, isPlayerTurn),
    roadBuildingComplete: guard(roadBuildingComplete, isPlayerTurn),
    isPlayerTurn,
    isGameEnded,
    isKnightPlayed,
    isMonopolyPlayed,
    isRoadBuildingPlayed,
    isYearOfPlentyPlayed
  },
});

export function createBaseGameStateMachine(
  gameState: GameState,
  dispatcher: Dispatcher<MyRoom>
) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IATAFYAHCTtW7agJwBGOwDYA7AGYPdxsAGhAAT0QAFjUHVzUvdy8XNT8bBJsAXwzQtCw8QlJKanwoACVddAgeARFRUoB5fgARdS0kED0DIxMzSwQ7OJJ3aMjXH2cUyLsfUIiEPwHHK2dXSJ9XW3ifLyycjBwCYnIqTBpyyuqhMQbmlXc2nX1DY1N2vr8fB3cPn0j3Vz8kS8Gxm4WskUiJC8wKsnjUPiCYysuxAuQOBRIACddBQKDQmrhMGBOA1eLxRE0AJIiVpmTrPHpvRDfHxqEiuDnTLxWeI2KxjWZRKxednxZYeaG+VYotH5I4MACumPwnCUTVEkgAqqVFLT2vTuq9QH1vi4SAjpjY+e51pE-FZBQhbA4efzXHYfvZEplsqj9nLSIrlZdajcWpo6U9Db1rLySJF+V4PkC1DZfqC5sMbCQbIDIny0s5hcKZf7DoGlSq+FdxFIZPIlKoI-qoy8Y06UiKETFpim0yEwQgALSJSF8+2fYU+BFeVOlvLlkhBqs1MSCSmSACaeseXTbTI7wKGNpZffTjuGJFSAOW3PcnmnEPn6Pllc4ACFNZuKcIAGrCXh6m4BRlFEQR+FKcMHg6VtGWNWNUnNGwOVzfxAW8LxHTtbNr2LKZkI9SJnwDJc32rb8mj-ACgJAyQwIgqDIz3OCLHBYUcwnVZ4TcWEM0QNIxz8Px4XtMY83cYjF2XD9+EUABpDVSmaYQdxg5ijVYw9syBXsEQWXNhkdKx1kcUYAl4q13GFHZfVlRcijCJowAANzAChdDINgOEEdBMSqVSDX3eCnQ2SEOXCiLwoHOZohFKxRkiyLJIxBynNc9zPPYBgfL8zg7mgwKWL6YVkPZRLIuiqJ4hIeLyoi5KjgcuT8FwKBsC4ALYI04rXD5HMxgRAFXC8bDIiwyFplTBNkJ8NIgnihrCioMJmta9q8vuJiGW66xoTZNQDrUf4RKmTDB0BKwoVEuwbvdBMghsvYFwxHAwEwABrGhhHwfzm13bb23ihIasSNRlhSd1uTsR0hysYSoUlRGkb8RaSFej6vp+jaCq69sbUGJHCd8R0+sLCFtlhB9fiIlF8F0CA4DMOyCi26MDxHPwzrmIdzKvET1hcYFhOM1GilOEp6CYFgvIYVmgs0odpjKuqIqM+14wTWc0z8E8UdsssUpOM4KggOWisQLwbHcRw4hsaIJ2nX5HQWVxzW2MHAW2IThlR7FcXxQkwDNnaECs6J2Q+ISxlWD1bCw9jjNnI67Cme2fSel8K2VYO8ZG62NmG5Mtdm53fivZD7WLe9pl+UXlrStyPJlnLTZbdTAYBSFhV67xtlZP4Se2IY3Eru8qbr9AVpatrZbbgGD35BMr0+O7Lb5eLKvmYzRSOjxnF+Ky7AnsJzggd8FVwCgIBoHP2Zux1pku69R8prlj7kEwPJxOZ-rZ4LFehoOdwB0RR2ArreV+2xj6bjAL5eoAAzbgLAOA-zUvPf+98gHDGts-CB1coH62ekcdGn0SjfVbr-eWxVQYw2EhNfm+Ykyph8KjdgDMKFoL-ppSurtWRphTlaHkAQxqDlht8Egbh3Rgw5FNb4PoshAA */
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
              actions: ["placeRoad", "nextPlayer", "updatePlayerLongestRoad"],
              guard: "initialRoundIsComplete",
            },
            {
              target: "placingSettlement",
              actions: ["placeRoad", "updatePlayerLongestRoad"],
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
          "setCanBuyDevelopmentCards",
          "setCanPlayDevelopmentCards"
        ],
        exit: [
          "clearAvailableSettlementIntersections",
          "clearAvailableCityIntersections",
          "clearAvailableEdges",
          "clearCanBuyDevelopmentCards",
          "clearCanPlayDevelopmentCards"
        ],
        on: {
          END_TURN: {
            target: "rollingDice",
            actions: ["clearNumberOfDevelopmentCardsPlayed", "nextPlayer"],
            guard: "isPlayerTurn",
          },
          PLACE_ROAD: {
            target: "checkingEnd",
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: [
              "buyRoad",
              "updatePlayerLongestRoad",
              "updatePlayerVictoryPoints",
            ],
            guard: "isPlayerTurn",
          },
          PLACE_SETTLEMENT: {
            target: "checkingEnd",
            actions: [
              "buySettlement",
              "updatePlayerExchangeRate",
              "updateLongestRoadAfterSettlementPlacement",
              "updatePlayerVictoryPoints",
            ],
            guard: "isPlayerTurn",
          },
          PLACE_CITY: {
            target: "checkingEnd",
            actions: ["buyCity", "updatePlayerVictoryPoints"],
            guard: "isPlayerTurn",
          },
          BUY_DEVELOPMENT_CARD: {
            target: "checkingEnd",
            actions: ["buyDevelopmentCard", "updatePlayerVictoryPoints"],
            guard: "isPlayerTurn",
          },
          PLAY_DEVELOPMENT_CARD: {
            target: "playingDevelopmentCard",
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
      playingDevelopmentCard: {
        entry: ["increaseNumberOfDevelopmentCardsPlayed"],
        always: [
          { guard: "isKnightPlayed", target: "playingKnight" },
          { guard: "isMonopolyPlayed", target: "playingMonopoly" },
          { guard: "isRoadBuildingPlayed", target: "playingRoadBuilding" },
          { guard: "isYearOfPlentyPlayed", target: "playingYearOfPlenty" },
          { target: "turn" },
        ],
      },
      playingKnight: {
        entry: ["playKnightDevelopmentCard"],
        exit: ["updateLargestArmy", "updatePlayerVictoryPoints"],
        always: [{ guard: "isGameEnded", target: "ended" }, { target: "moveRobber" }],
      },
      playingMonopoly: {
        entry: ["playMonopolyDevelopmentCard", "setAvailablePlayersToMonopolyzeFrom"],
        exit: ["clearAvailablePlayersToSomethingFrom"],
        on: {
          SELECT_MONOPOLY_RESOURCE: {
            target: "turn",
            actions: ["monopolizeResource"],
            guard: "isPlayerTurn",
          },
        },
      },
      playingRoadBuilding: {
        entry: ["playRoadBuildingDevelopmentCard"],
        always: { target: "placingRoadBuilding" },
      },
      playingYearOfPlenty: {
        entry: ["playYearOfPlentyDevelopmentCard"],
        on: {
          SELECT_YEAR_OF_PLENTY_RESOURCES: {
            target: "turn",
            actions: ["getYearOfPlentyResources"],
            guard: "isPlayerTurn",
          },
        },
      },
      moveRobber: {
        entry: ["setAvailableHexesForRobber"],
        exit: ["clearAvailableHexes"],
        on: {
          MOVE_ROBBER: {
            target: "stealingResource",
            actions: ["moveRobber"],
            guard: "isPlayerTurn",
          },
        },
      },
      stealingResource: {
        entry: ["setAvailablePlayersToStealFrom"],
        exit: ["clearAvailablePlayersToSomethingFrom"],
        on: {
          STEAL_RESOURCE: {
            target: "turn",
            actions: ["stealResource"],
            guard: "isPlayerTurn",
          },
        },
      },
      placingRoadBuilding: {
        entry: ["setAvailableEdges"],
        exit: ["clearAvailableEdges"],
        on: {
          PLACE_ROAD: [
            {
              target: "turn",
              actions: ["placeRoad", "updatePlayerLongestRoad", "clearRoadBuildingPhase"],
              guard: "roadBuildingComplete",
            },
            {
              target: "placingRoadBuilding",
              actions: ["placeRoad", "updatePlayerLongestRoad", "increaseRoadBuildingPhase", "setAvailableEdges"],
              guard: "isPlayerTurn",
            },
          ],
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
