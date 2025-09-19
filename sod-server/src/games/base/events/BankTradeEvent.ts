import { BankTradeCommand } from '../commands/BankTradeCommand';

export type BankTradeEvent = { 
  type: 'BANK_TRADE'; 
  payload: BankTradeCommand['payload'] 
};
