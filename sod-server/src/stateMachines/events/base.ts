import { PlaceInitialRoadCommand } from '../../commands/base/PlaceInitialRoadCommand'
import { PlaceSettlementCommand } from '../../commands/base/PlaceSettlementCommand'

type PlaceSettlementEvent = { type: 'PLACE_SETTLEMENT'; payload: PlaceSettlementCommand['payload'] }
type PlaceRoadEvent = { type: 'PLACE_ROAD'; payload: PlaceInitialRoadCommand['payload'] }
type RollDiceEvent = { type: 'ROLL_DICE' }
type EndTurn = { type: 'END_TURN' }

type Events = PlaceSettlementEvent | PlaceRoadEvent | RollDiceEvent | EndTurn

export { PlaceSettlementEvent, PlaceRoadEvent, RollDiceEvent, EndTurn, Events }
