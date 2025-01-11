import { Dispatcher } from '@colyseus/command'
import { createActor, setup } from 'xstate'
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
import {
  buyRoad,
  buySettlement,
  buyCity,
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
    buyCity,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNxwEYbATjWuArABZXO0crABoQAE9EG18SOzi7Kw8fR2cAdldbAF9MsLQsPEJSSmp8KAAlXXQIHgERUTKAeX4AEXUtJBA9AyMTM0sERy8SVz81O1dUqytgm0mwyIRXD1SSD0C7NUc7VM2rNR87bNyMHAJicipMGgqqmqExRpaVV3adfUNjUw7+qZthtQ8VlSW3cqSSflS80QriWJHSVh86ymdgOfkcRxAeVOhRIACddBQKDRmrhMGBOI1eLxRM0AJIiNpmLofXrfaEBKyrGyeDyzIKOUaQiLWbaxWwQvx+IFqMH7DFYgrnBgAV1x+E4SmaokkAFUyopGR1mT0vqB+hkwSQ-EF0jNEtabFDFq41CQ1Na3B4An57FZXPKTorSCq1Xc6o9Wpome8TX1oSiVpMfDYrJK-EkRnYnRCSP5koMXD5UimNn4A-kzsHVeq+PdxFIZPIlKoo0aY5844svK44W5PGmwTCnS7Xe787zHEWS9kciB8LoIHAzArK9Huh22QgALRZ4XbxKrfwulJjXmpVKHWcrnHFK6lehMFhsDhrlmmiyIH3D4Fuqx2H3LH+wSJOW2LnLe1yVBAr6xpuKI9oMYxSv4Y4XsOyxOHYgGOGMkxbB4oFBniBJEqUJJkjBG5mtCNijKsQJovsKIQrYTopn4JB-ssUojGMMpBIRlYkCG77GlRH6LHY9hOO4-gDmsGTDs4Vo+HsXrBI457OGWM5AA */
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
          },
          BUY_CITY: {
            target: 'turn',
            // forces the exit and entry transitions on 'turn' state to be rerun
            reenter: true,
            actions: 'buyCity',
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
