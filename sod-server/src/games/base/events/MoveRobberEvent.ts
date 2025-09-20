import { MoveRobberCommand } from '../commands/MoveRobberCommand';

export type MoveRobberEvent = { 
  type: 'MOVE_ROBBER'; 
  payload: MoveRobberCommand['payload'] 
};
