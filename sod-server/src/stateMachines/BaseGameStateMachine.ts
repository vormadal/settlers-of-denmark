import { Dispatcher } from '@colyseus/command'
import { createActor, setup } from 'xstate'
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
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
  updatePlayerExchangeRateCommand,
  updatePlayerVictoryPointsCommand,
  updatePlayerLongestRoad,
  UpdateLongestRoadAfterSettlmentPlacement
} from './actions/base'
import { Events } from './events/base'
import { guard, initialRoundIsComplete, isPlayerTurn } from './guards/base'

export type InputType = {
  event: Events
  context: {
    gameState: GameState
    dispatcher: Dispatcher<MyRoom>
  }
}

const machineConfig = setup({
  types: {
    context: {} as InputType['context'],
    events: {} as InputType['event']
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
    updatePlayerExchangeRateCommand,
    updatePlayerVictoryPointsCommand,
    updatePlayerLongestRoad,
    UpdateLongestRoadAfterSettlmentPlacement
  },
  guards: {
    initialRoundIsComplete: guard(initialRoundIsComplete, isPlayerTurn),
    isPlayerTurn
  }
})

export function createBaseGameStateMachine(gameState: GameState, dispatcher: Dispatcher<MyRoom>) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNx2oCcARkd2A7Fc8eAKwANCAAnogALGo+JIE+LlaRvmo2Lh5WAL6ZoWhYeISklNT4UABKuugQPAIiomUA8vwAIupaSCB6BkYmZpYIjm5qJB7RkW4JrkmOPqERCFaDTmmDkT5uNoFqvnbZuRg4BMTkVJg0FVU1QmKNLSoe7Tr6hsamHf1WPo4jnz6RHm4knYNrNwogbJFIiQ7MCbF4YkEJjY9iA8odCiQAE66CgUGjNXCYMCcRq8XiiZoASREbTMXRevXeiAyPmGbnZMzsNm2gRsEzmUXsJCGXL5HhhvjckRRaIKxwYAFdMfhOEpmqJJABVMqKWkdek9N6gfoZVwkHxeHyBXkedaRWwChCbb7cvluRy-QKOcWBGUHOWkRXKq51W6tTR056GvrgtSjJy8wL-XnbVI2R0AWg8cJGdkim3GdkC2asdiyOVR-qOgaVKr413EUhk8iUqgj+qjrxjToBUMCgImX0CdgBVkdSRINisan89pLkV5fvy1ZIQbrtTEgkpkgAmnqnt0u0ye-2nO7bT4vp8YY7kyRPoMZ658-3rUv0fLa5wAEL8RQAaQ1MoWmEfdOk7RljXBbkHDsD1gRmXlFhCMEnTSaEhjcftPilPlUmyCt8F0CA4DMWVq0jQ9IIsRAM0BOJM25b4YXzLkgjWSJHGSd8AxOEo6EYZhWHYBhKIZI0aIQDMFwY1DS2YjY7DUeIrFtDIeJXYozlKC4IDE6NjyLDwz2U6JbEvS9InHJZLyUqc1jLVTpQrciMWxXF8UJMB9KPKCEGzaJhU+Kx-DtD1NlvIUbB8JS4y4riZ19FyqwxNcfOok082MjY3DLP4lPiFD5k+KErGwtI2MtP4CMyIA */
    context: { gameState: gameState, dispatcher: dispatcher },
    initial: 'placingSettlement',
    states: {
      placingSettlement: {
        entry: ['nextPlayer', 'setAvailableSettlementIntersections'],
        exit: ['clearAvailableSettlementIntersections'],
        on: {
          PLACE_SETTLEMENT: {
            target: 'placingRoad',
            actions: ['placeSettlement', 'produceInitialResources', 'updatePlayerExchangeRateCommand', 'updatePlayerVictoryPointsCommand'],
            guard: 'isPlayerTurn'
          }
        }
      },
      placingRoad: {
        entry: ['setAvailableEdges'],
        exit: ['clearAvailableEdges'],
        on: {
          PLACE_ROAD: [
            {
              target: 'rollingDice',
              actions: ['placeRoad', 'nextPlayer', 'updatePlayerLongestRoad'],
              guard: 'initialRoundIsComplete'
            },
            {
              target: 'placingSettlement',
              actions: ['placeRoad', 'updatePlayerLongestRoad'],
              guard: 'isPlayerTurn'
            }
          ]
        }
      },
      rollingDice: {
        on: {
          ROLL_DICE: {
            target: 'turn',
            actions: ['rollDice', 'produceResources'],
            guard: 'isPlayerTurn'
          }
        }
      },
      turn: {
        entry: ['setAvailableSettlementIntersections', 'setAvailableCityIntersections', 'setAvailableEdges'],
        exit: ['clearAvailableSettlementIntersections', 'clearAvailableCityIntersections', 'clearAvailableEdges'],
        on: {
          END_TURN: {
            target: 'rollingDice',
            actions: 'nextPlayer',
            guard: 'isPlayerTurn'
          },
          PLACE_ROAD: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: ['buyRoad', 'updatePlayerLongestRoad'],
            guard: 'isPlayerTurn'
          },
          PLACE_SETTLEMENT: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: ['buySettlement', 'updatePlayerExchangeRateCommand', 'updatePlayerVictoryPointsCommand', 'UpdateLongestRoadAfterSettlmentPlacement'],
            guard: 'isPlayerTurn'
          },
          PLACE_CITY: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: ['buyCity', 'updatePlayerVictoryPointsCommand'],
            guard: 'isPlayerTurn'
          },
          BANK_TRADE: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: 'bankTrade',
            guard: 'isPlayerTurn'
          }
        }
      }
    }
  })
  const actor = createActor(machine)
  actor.subscribe((state) => {
    gameState.phase = state.value as string
  })

  return actor
}
