import { PlaceInitialRoadCommand } from '../commands/PlaceInitialRoadCommand';

export type PlaceRoadEvent = { 
  type: 'PLACE_ROAD'; 
  payload: PlaceInitialRoadCommand['payload'] 
};
