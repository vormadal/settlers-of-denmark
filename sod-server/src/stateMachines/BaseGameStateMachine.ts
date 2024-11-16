import { Dispatcher } from '@colyseus/command'
import { createActor, setup } from 'xstate'
import { PlaceSettlementCommand } from '../commands/base/PlaceSettlementCommand'
import { PlaceRoadCommand } from '../commands/base/PlaceRoadCommand'
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
import { NextPlayerCommand } from '../commands/base/NextPlayerCommand'
import { SetAvailableSettlementIntersectionsCommand } from '../commands/base/SetAvailableSettlementIntersectionsCommand'
import { SetAvailableRoadEdgesCommand } from '../commands/base/SetAvailableRoadEdgesCommand'
import { ClearAvailableEdgesCommand } from '../commands/base/ClearAvailableEdgesCommand'
import { ClearAvailableIntersectionsCommand } from '../commands/base/ClearAvailableIntersectionsCommand'
import { RollDiceCommand } from '../commands/base/RollDiceCommand'

type PlaceSettlementEvent = { type: 'PLACE_SETTLEMENT'; payload: PlaceSettlementCommand['payload'] }
type PlaceRoadEvent = { type: 'PLACE_ROAD'; payload: PlaceRoadCommand['payload'] }
type RollDiceEvent = { type: 'ROLL_DICE' }

const machineConfig = setup({
  types: {
    input: { gameState: GameState, dispatcher: Dispatcher<MyRoom> },
    context: {} as { gameState: GameState; dispatcher: Dispatcher<MyRoom> },
    events: {} as PlaceSettlementEvent | PlaceRoadEvent | RollDiceEvent | { type: 'END_TURN' }
  },
  actions: {
    placeSettlement: ({ event, context }) => {
      const e = event as PlaceSettlementEvent
      context.dispatcher.dispatch(new PlaceSettlementCommand(), e.payload)
    },

    placeRoad: ({ event, context }) => {
      const e = event as PlaceRoadEvent
      context.dispatcher.dispatch(new PlaceRoadCommand(), e.payload)
    },
    nextPlayer: ({ context }) => context.dispatcher.dispatch(new NextPlayerCommand()),
    setAvailableIntersections: ({ context }) =>
      context.dispatcher.dispatch(new SetAvailableSettlementIntersectionsCommand(), { initialPlacement: true }),
    setAvailableEdges: ({ context }) =>
      context.dispatcher.dispatch(new SetAvailableRoadEdgesCommand(), { initialPlacement: true }),
    clearAvailableEdges: ({ context }) => context.dispatcher.dispatch(new ClearAvailableEdgesCommand()),
    clearAvailableIntersections: ({ context }) => context.dispatcher.dispatch(new ClearAvailableIntersectionsCommand()),
    rollDice: ({ context }) => context.dispatcher.dispatch(new RollDiceCommand())
  },
  guards: {
    initialRoundIsComplete: ({ context }) => {
      const players = Array.from(context.gameState.players.values())
      const playersWithMissingRoad = players.filter((player) => player.roads.filter((road) => road.edge).length < 2)
      // we perform the guard before the last road is placed
      // therefore we need to check if there is only one player left
      return playersWithMissingRoad.length === 1
    }
  }
})

export function createBaseGameStateMachine(gameState: GameState, dispatcher: Dispatcher<MyRoom>) {
  const machine = machineConfig.createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAbLAqAZTABcGKxUx8GBiABQBkBBAMIBRAPq1hAFUm9hAWWEA5SQG0ADAF1EoMgHtYuBrl35tIAB6IAzACYAbCQAcNxwEYALAFZ3V9+7vuADQgAJ6IrgDsESReVq42EQCc7hGeafYAvhnBaFh4hKSU1PhQAEq66BA8AiKipQDy-AAi6lpIIHoGRiZmlgiO7mokAWp2iTY2nkmOiRHBYQiunokkEWpxEzajVqPrWTkYOATE5FSYNOWV1UJiDc0qrm06+obGpu19tg7Obl4+fgF5og3DFEmDEmoZstXI5PPsQLkjgUSAAnXQUCg0Jq4TBgTgNXi8URNACSIlaZk6rx6H3CtmiqTUahsvkmrjsbiBizsDMcAX8fhs7NSEXhiPyJwYAFcUfhOEomqJJABVUqKCntKndd6gPquWwrRIctw2I3xXxc1yREguAJjXxg9mmrLZED4XQQOBmcXHIiUl7a3qIAC0di5oZITKj0ZjotdPuRRXOJXoTBYbA4-q6byDCHcNkt9hIyzsVlSAJhsysYsOEsKZwuFQgWepOosiDszJIVghdjsnki9lGYdC4X8MVNPKsnkhZZ5NbyvtR6MxJWxuJbgdpi1ciVcMTLA4iO18MyCo8WzhI41mMOZsUSjgXSMlMrbWpz248EX3gzsptnTxnCAy1YQnI0RUcAYTzsF0MiAA */
    context: { gameState: gameState, dispatcher: dispatcher },
    initial: 'placingSettlement',
    states: {
      placingSettlement: {
        entry: ['nextPlayer', 'setAvailableIntersections'],
        exit: ['clearAvailableIntersections'],
        on: {
          PLACE_SETTLEMENT: {
            target: 'placingRoad',
            actions: 'placeSettlement'
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
              target: 'placingSettlement',
              actions: 'placeRoad'
            }
          ]
        }
      },
      rollingDice: {
        on: {
          ROLL_DICE: {
            target: 'turn',
            actions: 'rollDice'
          }
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
