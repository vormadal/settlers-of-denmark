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
  updatePlayerExchangeRateCommand
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
    updatePlayerExchangeRateCommand
  },
  guards: {
    initialRoundIsComplete: guard(initialRoundIsComplete, isPlayerTurn),
    isPlayerTurn
  }
})

export function createBaseGameStateMachine(gameState: GameState, dispatcher: Dispatcher<MyRoom>) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNx2oCcARkd2A7Fc8eAKwANCAAnogALGo+JIE+LlaRvmo2Lh5WAL6ZoWhYeISklNT4UABKuugQPAIiomUA8vwAIupaSCB6BkYmZpYIjm5qJB7RkW4JrkmOPqERCFaDTmmDkT5uNoFqvnbZuRg4BMTkVJg0FVU1QmKNLSoe7Tr6hsamHf1WPo4jnz6RHm4knYNrNwogbJFIiQ7MCbF4YkEJjY9iA8odCiQAE66CgUGjNXCYMCcRq8XiiZoASREbTMXRevXeiAyPliELcMzsNm2gRsEzm1gmJCGdg8Pl5HhcPjUjhRaIKxwYAFdMfhOEpmqJJABVMqKWkdek9N6gfostwkZIzQIS9aRWwChZqDzC3luDm-QKODx2QJyg4K0jK1VXOq3VqaOnPY19cFqXlxdzeAFbNx2Kx2R2fOJJSK8wJc5xc3Y5VEBo5BlVqvjXcRSGTyJSqSOG6OvWMIbk2KwkdYeDI+ryRRyRR2S4YTXxwvwrfzI0vyiskYPV2piQSUyQATQNT267Y680+UKsgUBaS5-Zmf1C-W5wJGYpZyXjfx8-vyS5XnAAQvxFAA0lqZQtMIu6dG2jKmnGvqWnYMxrBkjiBFYoyOjY6xOOMc5ijakowtkpb4LoEBwGYi6FFG+5QRYiAALSZmCCB0eMwq+ihvhprY7qygu5YYsUZylPQTAsGwHBUQyJq0QgkQ2FmD5uHJdivqhPgZB+6LHIJ5yVBAkkxkyCC+i6gzxtEtisqyo5MYsFqsip3ZrOmqGRJpgZYjieKlASRIGQe0EIJK0TCp8Vj+Haji2CETHKSQGEqc6I4jmop7uV+Vb+TRZp2P8wp8umfwqfEMVHn8JCnue9hwl41mEZkQA */
    context: { gameState: gameState, dispatcher: dispatcher },
    initial: 'placingSettlement',
    states: {
      placingSettlement: {
        entry: ['nextPlayer', 'setAvailableSettlementIntersections'],
        exit: ['clearAvailableSettlementIntersections'],
        on: {
          PLACE_SETTLEMENT: {
            target: 'placingRoad',
            actions: ['placeSettlement', 'produceInitialResources', 'updatePlayerExchangeRateCommand'],
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
              actions: ['placeRoad', 'nextPlayer'],
              guard: 'initialRoundIsComplete'
            },
            {
              target: 'placingSettlement',
              actions: 'placeRoad',
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
            actions: 'buyRoad',
            guard: 'isPlayerTurn'
          },
          PLACE_SETTLEMENT: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: ['buySettlement', 'updatePlayerExchangeRateCommand'],
            guard: 'isPlayerTurn'
          },
          PLACE_CITY: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: 'buyCity',
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
