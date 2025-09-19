import { PlaceInitialSettlementCommand } from '../commands/PlaceInitialSettlementCommand';

export type PlaceSettlementEvent = { 
  type: 'PLACE_SETTLEMENT'; 
  payload: PlaceInitialSettlementCommand['payload'] 
};
