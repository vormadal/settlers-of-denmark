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
  playRoadBuildingDevelopmentCard,
  setAvailablePlayersForDiscarding,
  discardResources,
  removePlayerFromSomethingList,
  clearCurrentDevelopmentCardId,
  setCanPlayKnightDevelopmentCards,
  clearCanPlayKnightDevelopmentCards,
  clearHasDiceBeenRolled,
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
  roadBuildingComplete,
  isDieCastSeven,
  noPlayersTooRich,
  isPlayerTooRich,
  hasDiceBeenRolled,
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
    playRoadBuildingDevelopmentCard,
    setAvailablePlayersForDiscarding,
    discardResources,
    removePlayerFromSomethingList,
    clearCurrentDevelopmentCardId,
    setCanPlayKnightDevelopmentCards,
    clearCanPlayKnightDevelopmentCards,
    clearHasDiceBeenRolled,
  },
  guards: {
    initialRoundIsComplete: guard(initialRoundIsComplete, isPlayerTurn),
    roadBuildingComplete: guard(roadBuildingComplete, isPlayerTurn),
    isPlayerTurn,
    isGameEnded,
    isKnightPlayed,
    isMonopolyPlayed,
    isRoadBuildingPlayed,
    isYearOfPlentyPlayed,
    isDieCastSeven,
    noPlayersTooRich,
    isPlayerTooRich,
    hasDiceBeenRolled,
  },
});

export function createBaseGameStateMachine(
  gameState: GameState,
  dispatcher: Dispatcher<MyRoom>
) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IATAFYAHCTtW7agJwBGOwDYA7AGYPdxsAGhAAT0QAFjUHVzUvdy8XNT8bBJsAXwzQtCw8QlJKanwoACVddAgeARFRUoB5fgARdS0kED0DIxMzSwQ7OJJ3aMjXH2cUyLsfUIiEPwHHK2dXSJ9XW3ifLyycjBwCYnIqTBpyyuqhMQbmlXc2nX1DY1N2vr8fB3cPn0j3Vz8kS8Gxm4WskUiJC8wKsnjUPiCYysuxAuQOBRIACddBQKDQmrhMGBOA1eLxRE0AJIiVpmTrPHpvRDfGx+EijVzTLxWeI2KxjWaIGz-dnxZYeaG+VYotH5I4MACumPwnCUTVEkgAqqVFLT2vTuq9QH1vi4SAjpjY+e51pE-FZBQhbA4efzOT97IlMtlUfs5aRFcrLrUbi1NHSnobesyBmygrC-nYrX5-iEwQgALS+dleFO+G3whHCmV+w4BpUqvhXcRSGTyJSqcP6yMvaMITzCkiclxJ-4fXN+R0ZqyRKyOFPLaGuDxJux+Et5MskQOVmpiQSUyQATT1jy6raZ7YGXnHri8Njc7m+0S8js5XZTcRhCJ8xZ9sqXK84ACFNVuKcIABqwi8PU3AKMooiCPwpRhg8HQtoyxrWCkNjmjY06sv4gLTI6EInvaVgfHy0ILB4kQLui8oVpc-5NEBIFgRBkhQTBcERvuSEWCh9okGofyeF4HI9g66a5ieNjbAs9g2KOZ4Ue+pYYl+378IoADSGqlM0wi7ghnFGtxToxCePJ8tOAT8Vejr8myqxTMssY2giOyKYuGJFGE+JgAAbmAFC6GQbAcII6CYlUekGgeyFOtMagkAmajLICKT2reYk+PFKYuVY3L2layJuVRhRUF5JRNL5-mBcFDCheFnB3PBUVce8-I+Hx3zni4fjwoCjq+BJdjOUCaijXO3p7O5Ryed5fkBUF7C1WFEVWE1iGGe8vyQhs9i5Umr52N4-XbCQnrrHYow+FdziUf6xzoGVUAVXN1WLXVEV+GtBltn8SRDFaAK5hdI7pXMA2nUNr7wklAR-LdS4zeVlXzTV70NZEX0MhtUSwieQlDURAwsnYjr2O1Kbwt8CxODE8MeaVNDqfguBQNgXCRetbbOP4JAfElYwIleVqgnMcRoReiLTLCk6FZNxX3Y9TMs2zDX3BxWNc4dbIXUkrKsl1Vp3rJQz8UJoxuBCAJ09NDMlHIJiBTiYScBIsiCCxcj1IoYH1Lw-6lMItD1NqNJNnuGuHva3yOJJN7fKNsmg8yUxoTEQKsnaBX+NbJUPWcFQQN+Cq4BQEA0A1Yf6RHMULFY7XQmongDBeQm-I6h3tdOwIyXOU4Tb6U2549W5gGF9QAGbcCwHDO67wju6IW7CDBoj1AAYqIfANv7gfB6UIi0Bz32Hn88S88Cua-HEriyY6iQQuy-Zd0RUOuDnJC4LABJgKFsAMPQfkVRH2rkZRI2ZhhpFWAiWu3w75qHsEsbuiRliyXfp-b+v9-6VSAWrZsx8YqJA2FCdwsJBYQgGBddu6x2TnWwvAiE-J35l1gJgZaZw4C6CVESWAnAqS0GgrBOou8Q6B2AVGQ8PInBDD8OeHqp8ARXTvoJLskQrRTFzNEMUTDP6sPCuw2AnDMTcIrpjcRMURx2nHF4Ua-InB1wBHAhBThMrLEpmMPw84ip3VQLoPy5QABG-iwCYk4J7YCdR6jfm-MIUoYjopGWcLYDqbg3CkUypyJRuYEqqO2BdC8QJvDvx8X43QgTgkmPVmYoyj4HCNxiL8IIGFUgi2ZBhSEHj06AlSHybOXilx-1HniEopQOFcOJLQSQy9yQByDiIuJLVrAEyhK6bqTTKHpmGEksYAI1j9mGDfd+RRTjDILkXEuZcSjBmuI0dieCQHvCEq4XmGFZy+AcqkO+woHDrG2J6Pa6x+4fnpsUMopzi6l3LlWEMNzGqVPie8aY7h0IQkIjyf4r4lG8TPD1eyL5xh2HfjgMAmAADWNBhD4AipXZq2N5juH4qdCEdpoRgPhGmOY0xpHCmsasDY-FpiEuwMSslJQKURVweHKpJohpsiSJ4MY1irpJiHPyJFRE7T7OiFeM83ofT4F0BAOAZggXEDhQszMnUhwfG+YCZw55oR134ock4NB6BMBYDVM1tKMycunH6-1AabK8QYdYyS2VvjOpBecCAXq2zniRQMehKQ65XTbumMi5ptgwzWAOYY79sS4nxISMAsbDwkOiA+bC2ypj5TwrlBKWbG4XQuqhd+K5S0EKEkijY2Lfihoxem34zyAQyyvNMX4kbHrPSqgtEKy0O0JMznxGmnIgSpnZYgaxbJJJCUbrCYYj5J2M2ZqzBgC6+jOCvFCfM9ozwd2hI6LaQxxiSX5MCNwN0+nAsevbfVegKBzElfCxA9peJDTnICTKEJUmPsBJmtIfdcoHK-TbPOJzKhnIhSUc9IHMpIp6vCTkqSd2Psys+3K-YUwuG5EekoI8x6T2ngwQDVcpVRHLQlDuzg7SrENumK6TzUjczRfYO0ssB7y3QbgH+6A-4APYDh9so5ISbM5NCVR40WntngRJfm54XwfHcNolhbDhmjKMUau5bHjI2gShhDw8D6Xdi0-SzwjgxojjkWkBSctvG+LAAEoJmJFOXqRbJaWfwAbNLgW55Ir5pLCh6q5Xz-SGCDP0YYokIXPgnhiNqzqawc132cGhIaaxVikX4ldSNxzQUYfBRcqAiniLbppi82G8Q7xZJvkltKuYrw+EFcK8llLmspCRf4Q6wwSHugHXMTwkJDrcpkbYXwMN37sENTGqzwG6VnihGo4UGErzcbvlI3MR2w0eP5PYLIWQgA */
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
        entry: [
          "setCanPlayKnightDevelopmentCards",
        ],
        exit: [
          "clearCanPlayKnightDevelopmentCards",
        ],
        on: {
          ROLL_DICE: {
            target: "isDieCastSeven",
            actions: ["rollDice", "produceResources"],
            guard: "isPlayerTurn",
          },
          PLAY_DEVELOPMENT_CARD: {
            target: "playingDevelopmentCard",
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
          "setCanPlayDevelopmentCards",
        ],
        exit: [
          "clearAvailableSettlementIntersections",
          "clearAvailableCityIntersections",
          "clearAvailableEdges",
          "clearCanBuyDevelopmentCards",
          "clearCanPlayDevelopmentCards",
        ],
        on: {
          END_TURN: {
            target: "rollingDice",
            actions: ["clearNumberOfDevelopmentCardsPlayed", "nextPlayer", "clearHasDiceBeenRolled"],
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
        exit: ["updateLargestArmy", "updatePlayerVictoryPoints", "clearCurrentDevelopmentCardId"],
        always: [
          { guard: "isGameEnded", target: "ended" },
          { target: "moveRobber" },
        ],
      },
      playingMonopoly: {
        entry: [
          "playMonopolyDevelopmentCard",
          "setAvailablePlayersToMonopolyzeFrom",
        ],
        exit: ["clearAvailablePlayersToSomethingFrom", "clearCurrentDevelopmentCardId"],
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
        exit: ["clearCurrentDevelopmentCardId"],
        on: {
          SELECT_YEAR_OF_PLENTY_RESOURCES: {
            target: "turn",
            actions: ["getYearOfPlentyResources"],
            guard: "isPlayerTurn",
          },
        },
      },
      isDieCastSeven: {
        always: [
          { guard: "isDieCastSeven", target: "discardingResources" },
          { target: "turn" },
        ],
      },
      discardingResources: {
        entry: ["setAvailablePlayersForDiscarding"],
        exit: ["clearAvailablePlayersToSomethingFrom"],
        on: {
          DISCARD_RESOURCES: {
            // Use 'internal: true' to avoid re-entry into this state
            internal: true,
            actions: ["discardResources", "removePlayerFromSomethingList"],
            guard: "isPlayerTooRich",
          },
        },
        always: {
          target: "moveRobber",
          guard: "noPlayersTooRich",
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
        always: [
          { guard: "isGameEnded", target: "ended" }
        ],
      },
      stealingResource: {
        entry: ["setAvailablePlayersToStealFrom"],
        exit: ["clearAvailablePlayersToSomethingFrom"],
        on: {
          STEAL_RESOURCE: {
            target: "hasDiceBeenRolled",
            actions: ["stealResource"],
            guard: "isPlayerTurn",
          },
        },
      },
      hasDiceBeenRolled:{
        always: [
          { guard: "hasDiceBeenRolled", target: "turn" },
          { target: "rollingDice" },
        ],
      },
      placingRoadBuilding: {
        entry: ["setAvailableEdges"],
        exit: ["clearAvailableEdges", "clearCurrentDevelopmentCardId"],
        on: {
          PLACE_ROAD: [
            {
              target: "checkingEnd",
              actions: [
                "placeRoad",
                "updatePlayerLongestRoad",
                "updatePlayerVictoryPoints",
                "clearRoadBuildingPhase",
              ],
              guard: "roadBuildingComplete",
            },
            {
              target: "placingRoadBuilding",
              actions: [
                "placeRoad",
                "updatePlayerLongestRoad",
                "updatePlayerVictoryPoints",
                "increaseRoadBuildingPhase",
                "setAvailableEdges",
              ],
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
