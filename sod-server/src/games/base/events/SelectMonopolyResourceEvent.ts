import { MonopolizeResourceCommand } from '../commands/MonopolizeResourceCommand';

export type SelectMonopolyResourceEvent = { 
  type: 'SELECT_MONOPOLY_RESOURCE'; 
  payload: MonopolizeResourceCommand['payload'] 
};
