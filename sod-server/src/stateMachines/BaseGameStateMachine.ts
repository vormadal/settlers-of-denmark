import { Dispatcher } from '@colyseus/command'
import { createActor, setup } from 'xstate'
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
import {
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
    placeRoad,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNxwEYALDfceAnAHY7Rz8AGhAAT0RXIJJXV38-ezcfG387AF800LQsPEJSSmp8KAAlXXQIHgERUWKAeX4AEXUtJBA9AyMTM0sERx81GPc1OzUfHys1VxsXUIiEVzsfEitFgNcAVj8-SbV3RwysjBwCYnIqTBpS8sqhMTrGlVcWnX1DY1NWnqtbGNGrMbUKXc7h8jlmiB8rhidhhNism3sCRcBxA2WOeRIACddBQKDQGrhMGBOHVeLxRA0AJIiZpmdpvLqfSJWLYkLwA9ZRUHAmzg+as9zrKyxNwBdbAjwotG5U4MACumPwnCUDVEkgAqsVFLTWvTOh9QD1XCylu5AuK7OK4a5AXy3CR1monbs-LZXH4zekUfhdBA4GZpSciHTXvruogALR2PlRqVHGX5c40ehMFhsDghjrvcMITx83wkPY+daOSb2KyeTxxnJBs6FEplCCZhkGiyIS1QvrDWJbeE2dbrfOLZbTRwlvtqb7Tavo07Y3H4wlgZthpnzLwDcZ+R0JJ0+OzuKx8mxqdZOUfblYD6eZVHx2vyxUr7Nrhb2JxTCa2QGW-z5rwkKCxYlnCEyCv4GQZEAA */
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
