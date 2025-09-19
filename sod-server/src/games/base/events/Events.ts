import { BankTradeEvent } from './BankTradeEvent';
import { EndTurn } from './EndTurn';
import { PlaceCityEvent } from './PlaceCityEvent';
import { PlaceRoadEvent } from './PlaceRoadEvent';
import { PlaceSettlementEvent } from './PlaceSettlementEvent';
import { RollDiceEvent } from './RollDiceEvent';

export type Events = 
  | PlaceSettlementEvent 
  | PlaceCityEvent 
  | PlaceRoadEvent 
  | BankTradeEvent 
  | RollDiceEvent 
  | EndTurn;
