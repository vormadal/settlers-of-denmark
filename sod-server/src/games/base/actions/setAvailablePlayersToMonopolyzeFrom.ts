import { InputType } from "../BaseGameStateMachine";
import { SetAvailablePlayersToMonopolyzeFromCommand } from "../commands/SetAvailablePlayersToMonopolyzeFromCommand";
import { BaseEvent } from "../events";

export function setAvailablePlayersToMonopolyzeFrom({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new SetAvailablePlayersToMonopolyzeFromCommand(), e.payload);
}
