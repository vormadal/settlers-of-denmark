import { InputType } from "../BaseGameStateMachine";
import { SetAvailablePlayersForDiscardingCommand } from "../commands/SetAvailablePlayersForDiscardingCommand";

export function setAvailablePlayersForDiscarding({ event, context }: InputType) {
  context.dispatcher.dispatch(new SetAvailablePlayersForDiscardingCommand());
}