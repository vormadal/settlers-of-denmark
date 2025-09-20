import { StealResourceCommand } from '../commands/StealResourceCommand';

export type StealResourceEvent = { 
  type: 'STEAL_RESOURCE'; 
  payload: StealResourceCommand['payload']
};