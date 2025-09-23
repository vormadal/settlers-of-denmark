import { GetYearOfPlentyResourcesCommand } from '../commands/GetYearOfPlentyResourcesCommand';

export type SelectYearOfPlentyResources = { 
  type: 'SELECT_YEAR_OF_PLENTY_RESOURCES'; 
  payload: GetYearOfPlentyResourcesCommand['payload'] 
};
