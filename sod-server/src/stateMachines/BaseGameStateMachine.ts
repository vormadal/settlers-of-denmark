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
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNxwEYbAVgA0IAJ6JXRwB2EldXAE4g8Nc7WLi7cIBfRJ80LDxCUkpqfCgAJV10CB4BEVE8gHl+ABF1LSQQPQMjEzNLBEdwtVCAFjU7Tx9-BBjwkisEqJj42KSUkDScAmJyKkwaAqKSoTFKmpVXep19Q2NTBvarW1C1cKsgnvCn5-CeocRo0JnvhOTUjCWmRIACddBQKDRqrhMGBOJVeLxRNUAJIiOpmJqnVoXAL3EKeNT9VxqKweVweAbvEZBEI9DxWdweP4LAEZFYMACuwPwnCU1VEkgAqnlFOiGpiWudQO1XPcxj07I43MTSeTKX5EG4SEzmfhdBA4GZFmyiBiTpK2ogALR2Kk25nG5ZZNY0ehMFhsDhm5pnS0IHo2KmuR4kHqdDyOK5RqOuB2sp2rHL5QoQb1YqUWRB2MlOLoDbwakYJcY2GzRH6-eaOoGg8GQ6FgNMWnEjGx9Eh3IIUlVkimBws2NQeJyl8s-Ob-dIJzncpu+lsxexORl2Htq-vDQeOEtl6bfObJIA */
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
