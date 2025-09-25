import { BankTradeEvent } from './BankTradeEvent';
import { BuyDevelopmentCardEvent } from './BuyDevelopmentCardEvent';
import { DiscardResourcesEvent } from './DiscardResourcesEvent';
import { EndTurn } from './EndTurn';
import { MoveRobberEvent } from './MoveRobberEvent';
import { PlaceCityEvent } from './PlaceCityEvent';
import { PlaceRoadEvent } from './PlaceRoadEvent';
import { PlaceSettlementEvent } from './PlaceSettlementEvent';
import { PlayDevelopmentCardEvent } from './PlayDevelopmentCardEvent';
import { RollDiceEvent } from './RollDiceEvent';
import { SelectMonopolyResourceEvent } from './SelectMonopolyResourceEvent';
import { SelectYearOfPlentyResources } from './SelectYearOfPlentyResources';
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
  | SelectMonopolyResourceEvent
  | SelectYearOfPlentyResources
  | DiscardResourcesEvent
  | EndTurn;
