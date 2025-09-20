import { BuyDevelopmentCardCommand } from '../commands/BuyDevelopmentCardCommand';

export type BuyDevelopmentCardEvent = { 
  type: 'BUY_DEVELOPMENT_CARD'; 
  payload: BuyDevelopmentCardCommand['payload'] 
};