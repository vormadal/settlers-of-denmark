import { InputType } from "../BaseGameStateMachine";
import { SetAvailablePlayersToStealFromCommand } from "../commands/SetAvailablePlayersToStealFromCommand";
import { BaseEvent } from "../events";

export function setAvailablePlayersToStealFrom({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new SetAvailablePlayersToStealFromCommand(), e.payload);
}
