import { Dispatcher } from '@colyseus/command'
import { createActor, setup } from 'xstate'
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
import {
  buyRoad,
  buySettlement,
  clearAvailableEdges,
  clearAvailableIntersections,
  nextPlayer,
  placeRoad,
  placeSettlement,
  produceInitialResources,
  produceResources,
  rollDice,
  setAvailableEdges,
  setAvailableIntersections
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
    placeRoad,
    buyRoad,
    nextPlayer,
    setAvailableIntersections,
    setAvailableEdges,
    clearAvailableEdges,
    clearAvailableIntersections,
    rollDice,
    produceInitialResources,
    produceResources
  },
  guards: {
    initialRoundIsComplete: guard(initialRoundIsComplete, isPlayerTurn),
    isPlayerTurn
  }
})

export function createBaseGameStateMachine(gameState: GameState, dispatcher: Dispatcher<MyRoom>) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNx2oCcARkd2A7Fc8eAKwANCAAnogALGo+JIE+LlaRvmo2Lh5WAL6ZoWhYeISklNT4UABKuugQPAIiomUA8vwAIupaSCB6BkYmZpYIjm5qJB7RkW4JrkmOPqERCFaDTmmDkT5uNoFqvnbZuRg4BMTkVJg0FVU1QmKNLSoe7Tr6hsamHf1WPo4jnz6RHm4knYNrNwogbJFIiQ7MCbF4YkEJjY9iA8odCiQAE66CgUGjNXCYMCcRq8XiiZoASREbTMXRevXeiAyPliELcMzsNm2gRsEzm1gmJCGdg8Pl5HhcPjUjhRaIKxwYAFdMfhOEpmqJJABVMqKWkdek9N6gfostwkZIzQIS9aRWwChZqDzC3luDm-QKODx2QJyg4K0jK1VXOq3VqaOnPY19Zm+4aBKweDJ2SLOZIZR02PyW7YQ+yuMXef35I5BlVqvjXcRSGTyJSqSOG6OvWMIH1wpySyHS3l8mxWR1i2KRRM8xyQxyrEvoxUVzgAIW1AE1RIJKZJlwant1W0z2zCrCQZV7NgOrKlB2CBi7xu7HIEhotC25sjkQPhdBA4GZ5WWo7ujKmogAC0diOmBM6BicJR0IwzCsOwDAAQyJoWFENiOlYwLCpE9hqPESY+BkUFljBZylBcEAoTG+6+i6gwEdEtisqykRYUsrJ2Jeax2FYSaRKRGLYri+KEmANF7sB7YQsMgJ+P4dqOLYITXnhDjZtxzoThOahWH675-hiwZoUaUnoQe-zCnyfF-Nx8SqfMnxQvpgJpFyyYzH8b6ZEAA */
    context: { gameState: gameState, dispatcher: dispatcher },
    initial: 'placingSettlement',
    states: {
      placingSettlement: {
        entry: ['nextPlayer', 'setAvailableIntersections'],
        exit: ['clearAvailableIntersections'],
        on: {
          PLACE_SETTLEMENT: {
            target: 'placingRoad',
            actions: ['placeSettlement', 'produceInitialResources'],
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
        entry: ['setAvailableIntersections', 'setAvailableEdges'],
        exit: ['clearAvailableIntersections', 'clearAvailableEdges'],
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
            actions: 'buySettlement',
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
