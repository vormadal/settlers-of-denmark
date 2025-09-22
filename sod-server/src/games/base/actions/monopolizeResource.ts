import { InputType } from "../BaseGameStateMachine";
import { MonopolizeResourceCommand } from "../commands/MonopolizeResourceCommand";
import { SelectMonopolyResourceEvent } from "../events";

export function monopolizeResource({ event, context }: InputType) {
  const e = event as SelectMonopolyResourceEvent;
  context.dispatcher.dispatch(new MonopolizeResourceCommand(), e.payload);
}
