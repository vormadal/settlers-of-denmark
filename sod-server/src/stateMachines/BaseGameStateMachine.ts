import { Dispatcher } from '@colyseus/command'
import { createActor, setup } from 'xstate'
import { PlaceHouseCommand } from '../commands/base/PlaceHouseCommand'
import { PlaceRoadCommand } from '../commands/base/PlaceRoadCommand'
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
import { NextPlayerCommand } from '../commands/base/NextPlayerCommand'
import { SetAvailableHouseIntersectionsCommand } from '../commands/base/SetAvailableHouseIntersectionsCommand'
import { SetAvailableRoadEdgesCommand } from '../commands/base/SetAvailableRoadEdgesCommand'
import { ClearAvailableEdgesCommand } from '../commands/base/ClearAvailableEdgesCommand'
import { ClearAvailableIntersectionsCommand } from '../commands/base/ClearAvailableIntersectionsCommand'

type PlaceHouseEvent = { type: 'PLACE_HOUSE'; payload: PlaceHouseCommand['payload'] }
type PlaceRoadEvent = { type: 'PLACE_ROAD'; payload: PlaceRoadCommand['payload'] }
export function createBaseGameStateMachine(gameState: GameState, dispatcher: Dispatcher<MyRoom>) {
  const machine = setup({
    types: {
      context: {} as { state: GameState },
      events: {} as PlaceHouseEvent | PlaceRoadEvent | { type: 'ROLL' } | { type: 'END_TURN' }
    },
    actions: {
      placeHouse: ({ event }) => {
        const e = event as PlaceHouseEvent
        dispatcher.dispatch(new PlaceHouseCommand(), e.payload)
      },

      placeRoad: ({ event }) => {
        const e = event as PlaceRoadEvent
        dispatcher.dispatch(new PlaceRoadCommand(), e.payload)
      },
      nextPlayer: () => dispatcher.dispatch(new NextPlayerCommand()),
      setAvailableIntersections: () =>
        dispatcher.dispatch(new SetAvailableHouseIntersectionsCommand(), { initialPlacement: true }),
      setAvailableEdges: () => dispatcher.dispatch(new SetAvailableRoadEdgesCommand(), { initialPlacement: true }),
      clearAvailableEdges: () => dispatcher.dispatch(new ClearAvailableEdgesCommand()),
      clearAvailableIntersections: () => dispatcher.dispatch(new ClearAvailableIntersectionsCommand())
    },
    guards: {
      initialRoundIsComplete: ({ context }) => {
        const players = Array.from(context.state.players.values())
        const playersWithMissingRoad = players.filter((player) => player.roads.filter((road) => road.edge).length < 2)
        // we perform the guard before the last road is placed
        // therefore we need to check if there is only one player left
        return playersWithMissingRoad.length === 1
      }
    }
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqACQHsBXWMAYgAUAZAQQGEBRAPq0A8gFUAyvwDaABgC6iUGXqxcAF1z18SkAA9EAZgBMANhIAOYxYCMxgJymA7IdsAWAKxuANCACeiDZOTiSehnYehs7GsiYAvnG+aFh4hKSU1PhQAEr06BAcPAKC2SLcACJyikggKmqa2roGCBZusiSmbaamsfZurha+AQg2HvYkTrF2sg52phZWCUkYOATE5FSYNLn5hXxCpRXSNtXKqhpaOjXNJuZWtg7OrjaePv6ItiQesj+yo7IWUz2P6GJYgZKrNIkABO9AoFBo5VwmDYpU4nCqujqF0a10CJhCTm+f1Mxg8806HiGgWBXxshhm-SJQVMQTBENS63UjGh+FY-AAcuVBAAVMTZAWYmrYhpXUDNenGQnEmyk8mAzzUkZtEggv72VXGMzdUFg-D0CBwXQctZELHnWVNRAAWlMWtdut+Xu9sic7JWnPSmxoDGYYHt9UuToQbmMWrmX0chjcFjGvsM9icNn9KVtG0yOTyEAjOLl+kQPWMJAzslJfVise68bc5ljjgWNhstYZ1hzkPWsPhiOR4elDqjeJGNgNoUMROMhlcDjJVPeIysJHsj1aFnshi8TlMfcDJG5vJLjsnLyBJBsFicbQZ+4ZC3jqdC25Te4PHj9CTiQA */
    context: { state: gameState },

    initial: 'placingHouse',

    states: {
      placingHouse: {
        entry: ['nextPlayer', 'setAvailableIntersections'],
        exit: ['clearAvailableIntersections'],
        on: {
          PLACE_HOUSE: {
            target: 'placingRoad',
            actions: 'placeHouse'
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
              actions: 'placeRoad',
              guard: 'initialRoundIsComplete'
            },
            {
              target: 'placingHouse',
              actions: 'placeRoad'
            }
          ]
        }
      },
      rollingDice: {
        on: {
          ROLL: 'turn'
        }
      },
      turn: {
        on: {
          END_TURN: 'rollingDice'
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
