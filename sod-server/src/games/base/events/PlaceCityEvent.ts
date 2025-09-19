import { PlaceCityCommand } from '../commands/PlaceCityCommand';

export type PlaceCityEvent = { 
  type: 'PLACE_CITY'; 
  payload: PlaceCityCommand['payload'] 
};
