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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IATAFYAHCTtW7agJwBGOwDYA7AGYPdxsAGhAAT0QAFjUHVzUvdy8XNT8bBJsAXwzQtCw8QlJKanwoACVddAgeARFRUoB5fgARdS0kED0DIxMzSwQ7OJJ3aMjXH2cUyLsfUIiEPwHHK2dXSJ9XW3ifLyycjBwCYnIqTBpyyuqhMQbmlXc2nX1DY1N2vr8fB3cPn0j3Vz8kS8Gxm4WskUiJC8wKsnjUPiCYysuxAuQOBRIACddBQKDQmrhMGBOA1eLxRE0AJIiVpmTrPHpvRDuWFqEiuDnTLxWeI2KxjWaIdbudnxZYeaG+VYotH5I7Y3H4wnEvj8ACaFOEADVhLx6twFMpRIJ+KUWpo6U9uq9QH0eQihl41GpxTE1pFBQhliLUgDltz3J4fMGZfs5aQGABXTH4ThKJqiSQAVVKilp7Xp1t6zOcDlh0xsfPc60ifisnp8NhIPhdnJ+9kSdlDeUOEejsdVtRu5oeHStL2zCE8AKGRb+dkLfn+ITBCAAtL4SECp75i-CETZ3M30UcozHLrUJNJZIbVBaM-3GbbmRORa47C5bwDtn4-J651ZIlZHFP-cCPBOdh+Nu4YkHuHY1GIgiUpIarpo8XQDkyQ4DF4P6uF4NhuIGgLxJ697slOcQwgilZbtkqJhq2YHtpwABCSYak02q6vqp7GqaPaWohV4WNYKRVpWHI2B8r5TKCcwQmhZZWB8fLQgsHiRCB1HgZcTEsXqBpKJIHFmvBfY8TafFeik35qH8nheKM94xOWs5eH4aE2C+gE2F+GHKRRsqqbRdH8IoADSialM0wgGZmSHXqZ3gkDyfIcgEFmBp6-J+OyEJOCsU7BokKkYkUYT4mAABuYAULoZBsBwgjoJiVQRZexl2tMbKwtEyy4a+VheJ6vhsjliQ9bJth8vlRyFcVZUVVV7AMLV9WcHcvaRbx7z8j4JBqN8mEuH48KAn12wkA2wZAs6MSpONhRUEVJRNKV5WVdV811Q1VgrU1g4fBC7K2E4SQufY3hHc5djFveozBuMTbeVRBW3VNT2zTVb1LX4n1GYOfxJKONgAo5dhfkCoMneDlbwi6AR-NdxzoHdUAPdNz1zQtDWRJjDLNVEsJodZ4OyQM3z2J69ibVO8LfAsTgxLTk0lIF+C4FA2BcI1WPIc4-gkB8ta5YGhYSYgcRVlhiLTLC-rInDLYI-TNCK8rqtLfc3Fc4OubpUTgOpE59iFvh7lDBZ1mjG4EIAnLiMlHIJiVTiYScBIsiCLpcj1Io+r1LwGqlMItD1CmNLngh7vIWW3yOC5-3jJhngznMwzTGTQIiaWhZWP4Uf2yU5wQHRka4BQEA0EtJeGWX0ULJ3UJOp4AxYdZvyeg+m0csC-tAdCriZDbO43T3UBqmAdX1AAZtwLAcInyfCKnohqsIpqiPUABioh8Dpuf54XpQiLQ6tJ4mT+PEHWwJHK-DiDvD0s5Ei-VLNsdeskKauFprgWABIwC1VgAwegZVYyAKzMhRIi5hhpFWAiae3xPTuDUPYJYG8hq2C8nsW2Rx0GYOwbgx6BDXYXg1tFRIGwoQsmLIGTKkMV7rCXOsaYr46EQn5LTEesBMBvTOHAXQ0YiSwE4FSWgJozR1B-kXfOhCoomR5E4IYft9ogOfEbIcVkMqFimI5aIYplHoLUfVDRsAtGYh0WPTmRDoqflLD+J0tYsrrDfLAuhDgnA1mWJLMYr5aaoF0GVcoAAjHJYBMScHTjqOo9Q6J0WEKUcxa1rBOCrNtNwbgFI1nvDQxI6VPwuSSJELCQJvAZKyWAXJ+TCnVO5vMf4DgGnTD+IWAELkaH40hGJTCgJUh8i7nvUCOCT54l7po7RxJaCSCfuSPOBdTFjI9p8TaLlATeGBMWfGNCvxsjGACNYHwEijF3qw-eJBsDoAwcqOiYB2DlFxJAYJbtQkmRwt+BEMyOTIs5H1HqS54iNmdKkBIOwtnUUBcCokoLwU4hYA1PhpdYV9EDC4OKQYbIotabOO5opuT7T5FOICvzKJsIPqcXuFR+6D2HqPTs1xGhcX4UA941lXA63xoBXwUxZIN2ZJuBw6xtgNh6tMHe3cBVlCFQPIeI8SgHglbcSlE9qWIAWA6SsEIZI8n+JWNpZZ2SOXDmsYsMNaY4DAJgAA1jQYQ+AGrj1WuMiWkJ3JOuhCQ+Ear+ibWFokcOGwLLTH9dgQNIaShhopSEixNLwbpSSMObY64Jzvn5CKWSpZhirG2v8TCWQKL4F0BAOAZgfIFBhSWxAc4drvg+JqtZHxxHDG2Aamg9AmAsBegOmp85m5MvXci1KHrFFOjuWI4C+K7aGr7su8ZddHAm2iGWaGy9ZyKWrFWhtL4pwsN5f8hUezGbKlPYOFk0RCL+ACCWICthPRfjQp3KJngphXp5X23c7Yf3EOsnefkEDzpA09D9BVfphq0rOt3BmTNkYvTZkhsJ7ctoy0hgkHeyanTpS6dEURwwiKEYdkrFWDByOWPBiKaElC0Or2hBWX6xZbDjAwlA5w7GY5xz0BQOYVLB3zBGo4TwYkawQiaRWQED60jb3kvqw9E1o5GsqCa0VJQePvBrD6Z0simldIrDWIYtcvlcs8SZg+DNj6nwvlfBgSmbUqb+J+OKq9nCllWAHWcwZ5WpC1i6+wpZrZ-NAhw3AWCgXcPwTZ5kxMhgeQeT07ljjaFpBOrWTCpFJ1eNUeo-Z-jDnwGlba0yxY4r4w8HQ2h95pg0O2ok50ThSwWTSK++DpBMnZN0Hkgp+WvR8ZOl+P9QR8apHK0NxwDmRITk3PtPF6XqI7PQJ+0oBzAlgEW53WKMRAweCcu6bYNDnBVnBmsVYCkLIhm8wCoFBJiVgvwBC8li3aH-uIv8IEUx7C+EG+irCaGXLFjq39oox7jUirNVARbclGMy0VdTPCs4MLpR3odssClAw+BzXm0N4a8cpBFP4B8wwWT3jkjQomjhbyOW5GkZJB7jsYnYN2iAePW1QlcZufGgYovc+-I5WXdzuo71hlkIAA */
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
