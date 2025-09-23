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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IATAFYAHCTtW7agJwBGOwDYA7AGYPdxsAGhAAT0QAFjUHVzUvdy8XNT8bBJsAXwzQtCw8QlJKanwoACVddAgeARFRUoB5fgARdS0kED0DIxMzSwQ7OJJ3aMjXH2cUyLsfUIiEPwHHK2dXSJ9XW3ifLyycjBwCYnIqTBpyyuqhMQbmlXc2nX1DY1N2vr8fB3cPn0j3Vz8kS8Gxm4WskUiJC8wKsnjUPiCYysuxAuQOBRIACddBQKDQmrhMGBOA1eLxRE0AJIiVpmTrPHpvRDfHxqEiuDnTLxWeI2KxjWZRKxednxZYeaG+VYotH5I4MACumPwnCUTVEkgAqqVFLT2vTuq9QH1vi4SAjpjY+e51pE-FZBQhbA4efzXHYfvZEplsqj9nLSIrlZdajcWpo6U9Db1mQM-ENrX87Fa-P8QmCEABaXwkIGp3w2+EImzuGX+w6BpUqvhXcRSGTyJSqCP6qMvGMITwl9l2FzJ-4fLx+PyOzNWSJWRyp5bQjldj1lvIVkhB6s1MSCSmSACaeseXXbTM7AxFHtcXhsbnc32iXkd7vZqbiMIRPhLi-R8qrnAAQprtxSwgAGrCLw9TcAoyiiII-ClOGDwdG2jLGtYKQ2OaNgcjYHzDlMoJzBCIr2lYHx8tCCweJEH4Biu341gBTTAaB4GQZI0GwfBkYHshFiofaJBqH8nheKM7oxA6GZDiKNjbAs9g2BO55Ub6srLquv78IoADSGqlM0wh7oh3FGrxToxCKPJ8hyASCdejr8vGqxTMscY2giOwqeWGJFGE+JgAAbmAFC6GQbAcII6CYlUhkGoeKFOtMbKwtEyyAik9p3pJrIkKm7nCiRth8tRy4+X5gXBaF7AMBFUWcHcCGxTx7z8j4AnfBeLh+PCgKOr40l2G5QJqMNHo+nsS7eVQvklE0AVBSFYXVZF0VWA1SEme8vyQhs9jCsmb69plcx9SQXrrHYow+FdzjFZN6DTVAs3lQtVU1dFfhrcZHZ-EkCaYX4Q4XeOR2ICdZ2XqyJGrKWnkTUcpUzXNFWLW9dWRJ9DIbUKiRQlM7gkQM3z2I69itam8LfAsTgxLd8NTTQWn4LgUDYFwMXrR2zj+DlkNjAi15WvhiBxOhl6ItMsIzsisOfoU9MlIzzOs3V9xcZjnO9vGF1JNh2EdVa94KUMgkiaMbgQgCtNy-dNByCYIU4mEnASLIghsXI9SKOB9S8ABpTCLQ9TajSLb7urR72t8jgybe3zDQpIOdlM6ExEC2F2laVj+Fbxw2yU5wQD+Cq4BQEA0HVodGeH8ULFnUJeGongDJeIm-I6vatRywLyR6s5jX6cPWw925gJF9QAGbcCwHBOy7whu6I27CLBoj1AAYqIfBNn7AdB6UIi0OzX1Hn88Q5cCQ6-HErgKY6iQQrmg5dyRb5uDnqC6IF5QAEbf2AmKcA9iBOo9Qfw-mEKUI+1dTLOFsG1NwbhyKsndHfRI8ZxwySSJES8QJvA51gAwUeeJ85wF0EqIkztJDL3JP7QOwcDKV0aljBK+MoSuk6v9C6d8JzoTGACNYg5hg3xzkUU4+cKiF2LqXcuNZQyNE4q2Y+NcRKuByphZM3hfhOFSHfEsDh1jbC9HtdY-dVJ3TEWUCRRcS5lxKCGa48j6pq2jBHaY7gMIQmIjyf4b5UH8XPF1Jyr5xh2BzjgMAmAADWNBhD4GiowjmEd3CCVOhCO00JEgN18RmaYQxUiJHNhsQS0wwnYAidEkosToqq0UdAk0A14xJE8GMLJnx0xzDHB4EgJE7RCOiNec8PpfT4F0BAOAZgzHEGcXFUymZ2qjg+PowE9pthjAhuOERJwaD0CYCwRa0ymqIEzLkjkpyznnPsvxCEwo1AyVyt8TZxRLGVAOcwi87iBi3OiCsq6bcMwUXNNsNQPTZKpmUuNWWWIcTEMeoSMAryOz42iI+fwARbQelsI6CcFkgWNwuhdNCOdVwIqPPfdxGwAm-AbjJdpiAPiQlSACKW15pi-EeQ9J681KrhWWiS+K45UgCWpu6IEaZaUIAbvGTB-TYTDCfOyhmTMWYMD5TAga7joQIntOeDu0JHRbSGOMGS-JgRuBujLGiCMoB2xGXoCgcww4uJrgVRwnhcKsghIg-VgJAVpD7sKYRFqSry2eZImxNBVWbUbjlYa51EGYP1dlG0wpByphcNyBVJQR5j0ntPBgDqq5OtMn8cc3SO7ODtKsA2GYrqqNSFzbx9g7TSwhTRD+X9dC-3-pG6w6rUmSz+FaAEMk754scLG7CyYSxdQ8q25cBCiFnFIeQ+FtSi19Czt4IVAz2prDWInfGyZXVrFWORQSV1HkWILtY6RJQe3zDfFK6m6iAi3nvEOdk2F4gZSHNeHwpTykxLiferqqZzRU2GPjd0pE74XUcP2KSthfDAr8DndgYyIAgf+CKC8CkSyYWvBW2Dk4hz4bucOfk9gshZCAA */
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
              target: "checkingEnd",
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
