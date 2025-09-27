import { DiscardResourcesCommand } from "../commands/DiscardResourcesCommand";

export type DiscardResourcesEvent = { 
  type: 'DISCARD_RESOURCES'; 
  payload: DiscardResourcesCommand['payload']
};
