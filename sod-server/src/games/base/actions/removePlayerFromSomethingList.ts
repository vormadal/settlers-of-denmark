import { InputType } from "../BaseGameStateMachine";
import { RemovePlayerFromSomethingListCommand } from "../commands/RemovePlayerFromSomethingListCommand";
import { BaseEvent } from "../events";

export function removePlayerFromSomethingList({ context, event }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new RemovePlayerFromSomethingListCommand(), e.payload);
}