import { ClearAvailableEdgesCommand } from '../../commands/base/ClearAvailableEdgesCommand'
import { ClearAvailableSettlementIntersectionsCommand } from '../../commands/base/ClearAvailableSettlementIntersectionsCommand'
import { ClearAvailableCityIntersectionsCommand } from '../../commands/base/ClearAvailableCityIntersectionsCommand'
import { NextPlayerCommand } from '../../commands/base/NextPlayerCommand'
import { PlaceInitialRoadCommand } from '../../commands/base/PlaceInitialRoadCommand'
import { PlaceRoadCommand } from '../../commands/base/PlaceRoadCommand'
import { PlaceInitialSettlementCommand } from '../../commands/base/PlaceInitialSettlementCommand'
import { PlaceSettlementCommand } from '../../commands/base/PlaceSettlementCommand'
import { ProduceInitialResourcesCommand } from '../../commands/base/ProduceInitialResourcesCommand'
import { ProduceResourcesCommand } from '../../commands/base/ProduceResourcesCommand'
import { RollDiceCommand } from '../../commands/base/RollDiceCommand'
import { SetAvailableEdgesCommand } from '../../commands/base/SetAvailableRoadEdgesCommand'
import { SetAvailableSettlementIntersectionsCommand } from '../../commands/base/SetAvailableSettlementIntersectionsCommand'
import { InputType } from '../BaseGameStateMachine'
import { BankTradeEvent, BaseEvent, PlaceCityEvent, PlaceRoadEvent, PlaceSettlementEvent } from '../events/base'
import { SetAvailableCityIntersectionsCommand } from '../../commands/base/SetAvailableCityIntersectionsCommand'
import { PlaceCityCommand } from '../../commands/base/PlaceCityCommand'
import { BankTradeCommand } from '../../commands/base/BankTradeCommand'
import { UpdatePlayerExchangeRateCommand } from '../../commands/base/UpdatePlayerExchangeRateCommand'
import { UpdatePlayerVictoryPointsCommand } from '../../commands/base/UpdatePlayerVictoryPointsCommand'
import { UpdatePlayerLongestRoadCommand } from '../../commands/base/UpdatePlayerLongestRoadCommand'
import { UpdateLongestRoadAfterSettlmentPlacementCommand } from '../../commands/base/UpdateLongestRoadAfterSettlmentPlacementCommand'

function placeSettlement({ event, context }: InputType) {
  const e = event as PlaceSettlementEvent
  context.dispatcher.dispatch(new PlaceInitialSettlementCommand(), e.payload)
}

function buySettlement({ event, context }: InputType) {
  const e = event as PlaceSettlementEvent
  context.dispatcher.dispatch(new PlaceSettlementCommand(), e.payload)
}

function buyCity({ event, context }: InputType) {
  const e = event as PlaceCityEvent
  context.dispatcher.dispatch(new PlaceCityCommand(), e.payload)
}

function placeRoad({ event, context }: InputType) {
  const e = event as PlaceRoadEvent
  context.dispatcher.dispatch(new PlaceInitialRoadCommand(), e.payload)
}

function buyRoad({ event, context }: InputType) {
  const e = event as PlaceRoadEvent
  context.dispatcher.dispatch(new PlaceRoadCommand(), e.payload)
}

function nextPlayer({ context }: InputType) {
  context.dispatcher.dispatch(new NextPlayerCommand())
}

function setAvailableSettlementIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableSettlementIntersectionsCommand(), { initialPlacement: context.gameState.round < 3 })
}

function setAvailableCityIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableCityIntersectionsCommand(), { initialPlacement: context.gameState.round < 3 })
}

function setAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableEdgesCommand(), { initialPlacement: context.gameState.round < 3 })
}

function clearAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableEdgesCommand())
}

function clearAvailableSettlementIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableSettlementIntersectionsCommand())
}

function clearAvailableCityIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableCityIntersectionsCommand())
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

function bankTrade({ event, context }: InputType) {
  const e = event as BankTradeEvent
  context.dispatcher.dispatch(new BankTradeCommand(), e.payload)
}

function updatePlayerExchangeRateCommand({ event, context }: InputType) {
    const e = event as BaseEvent;
    context.dispatcher.dispatch(new UpdatePlayerExchangeRateCommand(), { playerId: e.payload.playerId })
}

function updatePlayerVictoryPointsCommand({ event, context }: InputType) {
    const e = event as BaseEvent;
    context.dispatcher.dispatch(new UpdatePlayerVictoryPointsCommand(), { playerId: e.payload.playerId })
}

function updatePlayerLongestRoad({ event, context }: InputType) {
    const e = event as BaseEvent;
    context.dispatcher.dispatch(new UpdatePlayerLongestRoadCommand(), { playerId: e.payload.playerId })
}

function UpdateLongestRoadAfterSettlmentPlacement({ event, context }: InputType) {
    const e = event as PlaceSettlementEvent;
    context.dispatcher.dispatch(new UpdateLongestRoadAfterSettlmentPlacementCommand(), { playerId: e.payload.playerId, intersectionId: e.payload.intersectionId })
}

export {
    clearAvailableEdges, clearAvailableSettlementIntersections, clearAvailableCityIntersections, nextPlayer, placeRoad, buyRoad, placeSettlement, buySettlement, buyCity, produceInitialResources,
    produceResources, rollDice, setAvailableEdges, setAvailableSettlementIntersections, setAvailableCityIntersections, bankTrade, updatePlayerExchangeRateCommand, updatePlayerVictoryPointsCommand,
    updatePlayerLongestRoad, UpdateLongestRoadAfterSettlmentPlacement
}

