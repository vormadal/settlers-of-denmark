import { BankTradeEvent } from './BankTradeEvent';
import { BuyDevelopmentCardEvent } from './BuyDevelopmentCardEvent';
import { EndTurn } from './EndTurn';
import { MoveRobberEvent } from './MoveRobberEvent';
import { PlaceCityEvent } from './PlaceCityEvent';
import { PlaceRoadEvent } from './PlaceRoadEvent';
import { PlaceSettlementEvent } from './PlaceSettlementEvent';
import { PlayDevelopmentCardEvent } from './PlayDevelopmentCardEvent';
import { RollDiceEvent } from './RollDiceEvent';
import { StealResourceEvent } from './StealResource';

export type Events = 
  | PlaceSettlementEvent 
  | PlaceCityEvent 
  | PlaceRoadEvent 
  | BankTradeEvent 
  | RollDiceEvent 
  | BuyDevelopmentCardEvent
  | PlayDevelopmentCardEvent
  | MoveRobberEvent
  | StealResourceEvent
  | EndTurn;
