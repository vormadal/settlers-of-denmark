import { BankTradeCommand } from '../../commands/base/BankTradeCommand';
import { PlaceCityCommand } from '../../commands/base/PlaceCityCommand';
import { PlaceInitialRoadCommand } from '../../commands/base/PlaceInitialRoadCommand'
import { PlaceInitialSettlementCommand } from '../../commands/base/PlaceInitialSettlementCommand'

type BaseEvent = { type: string; payload: { playerId: string } }
type PlaceSettlementEvent = { type: 'PLACE_SETTLEMENT'; payload: PlaceInitialSettlementCommand['payload'] }
type PlaceCityEvent = { type: 'PLACE_CITY'; payload: PlaceCityCommand['payload'] }
type PlaceRoadEvent = { type: 'PLACE_ROAD'; payload: PlaceInitialRoadCommand['payload'] }
type BankTradeEvent = { type: 'BANK_TRADE'; payload: BankTradeCommand['payload'] }
type RollDiceEvent = { type: 'ROLL_DICE' }
type EndTurn = { type: 'END_TURN' }

type Events = PlaceSettlementEvent | PlaceCityEvent | PlaceRoadEvent | BankTradeEvent | RollDiceEvent | EndTurn

export { BaseEvent, PlaceSettlementEvent, PlaceCityEvent, PlaceRoadEvent, BankTradeEvent, RollDiceEvent, EndTurn, Events }
