import { PlaceCityCommand } from '../../commands/base/PlaceCityCommand';
import { PlaceInitialRoadCommand } from '../../commands/base/PlaceInitialRoadCommand'
import { PlaceInitialSettlementCommand } from '../../commands/base/PlaceInitialSettlementCommand'

type PlaceSettlementEvent = { type: 'PLACE_SETTLEMENT'; payload: PlaceInitialSettlementCommand['payload'] }
type PlaceCityEvent = { type: 'PLACE_SETTLEMENT'; payload: PlaceCityCommand['payload'] }
type PlaceRoadEvent = { type: 'PLACE_ROAD'; payload: PlaceInitialRoadCommand['payload'] }
type RollDiceEvent = { type: 'ROLL_DICE' }
type EndTurn = { type: 'END_TURN' }

type Events = PlaceSettlementEvent | PlaceCityEvent | PlaceRoadEvent | RollDiceEvent | EndTurn

export { PlaceSettlementEvent, PlaceCityEvent, PlaceRoadEvent, RollDiceEvent, EndTurn, Events }
