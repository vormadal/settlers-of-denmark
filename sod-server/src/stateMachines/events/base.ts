import { PlaceRoadCommand } from '../../commands/base/PlaceRoadCommand'
import { PlaceSettlementCommand } from '../../commands/base/PlaceSettlementCommand'

type PlaceSettlementEvent = { type: 'PLACE_SETTLEMENT'; payload: PlaceSettlementCommand['payload'] }
type PlaceRoadEvent = { type: 'PLACE_ROAD'; payload: PlaceRoadCommand['payload'] }
type RollDiceEvent = { type: 'ROLL_DICE' }
type EndTurn = { type: 'END_TURN' }

type Events = PlaceSettlementEvent | PlaceRoadEvent | RollDiceEvent | EndTurn

export { PlaceSettlementEvent, PlaceRoadEvent, RollDiceEvent, EndTurn, Events }
