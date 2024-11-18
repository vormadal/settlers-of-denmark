import { ClearAvailableEdgesCommand } from '../../commands/base/ClearAvailableEdgesCommand'
import { ClearAvailableIntersectionsCommand } from '../../commands/base/ClearAvailableIntersectionsCommand'
import { NextPlayerCommand } from '../../commands/base/NextPlayerCommand'
import { PlaceRoadCommand } from '../../commands/base/PlaceRoadCommand'
import { PlaceSettlementCommand } from '../../commands/base/PlaceSettlementCommand'
import { ProduceInitialResourcesCommand } from '../../commands/base/ProduceInitialResourcesCommand'
import { ProduceResourcesCommand } from '../../commands/base/ProduceResourcesCommand'
import { RollDiceCommand } from '../../commands/base/RollDiceCommand'
import { SetAvailableRoadEdgesCommand } from '../../commands/base/SetAvailableRoadEdgesCommand'
import { SetAvailableSettlementIntersectionsCommand } from '../../commands/base/SetAvailableSettlementIntersectionsCommand'
import { InputType } from '../BaseGameStateMachine'
import { PlaceRoadEvent, PlaceSettlementEvent } from '../events/base'

function placeSettlement({ event, context }: InputType) {
  const e = event as PlaceSettlementEvent
  context.dispatcher.dispatch(new PlaceSettlementCommand(), e.payload)
}

function placeRoad({ event, context }: InputType) {
  const e = event as PlaceRoadEvent
  context.dispatcher.dispatch(new PlaceRoadCommand(), e.payload)
}

function nextPlayer({ context }: InputType) {
  context.dispatcher.dispatch(new NextPlayerCommand())
}

function setAvailableIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableSettlementIntersectionsCommand(), { initialPlacement: context.gameState.round < 3 })
}

function setAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableRoadEdgesCommand(), { initialPlacement: context.gameState.round < 3 })
}

function clearAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableEdgesCommand())
}

function clearAvailableIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableIntersectionsCommand())
}

function rollDice({ context }: InputType) {
  context.dispatcher.dispatch(new RollDiceCommand())
}

function produceInitialResources({ context, event }: InputType) {
  const e = event as PlaceSettlementEvent
  context.dispatcher.dispatch(new ProduceInitialResourcesCommand(), e.payload)
}

function produceResources({ context }: InputType) {
  context.dispatcher.dispatch(new ProduceResourcesCommand())
}

export {
    clearAvailableEdges,
    clearAvailableIntersections, nextPlayer, placeRoad, placeSettlement, produceInitialResources,
    produceResources, rollDice, setAvailableEdges, setAvailableIntersections
}

