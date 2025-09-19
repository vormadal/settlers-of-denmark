import { InputType } from "../BaseGameStateMachine";
import { BankTradeCommand } from "../commands/BankTradeCommand";
import { BankTradeEvent } from "../events";

export function bankTrade({ event, context }: InputType) {
  const e = event as BankTradeEvent;
  context.dispatcher.dispatch(new BankTradeCommand(), e.payload);
}
