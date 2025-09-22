import { InputType } from "../BaseGameStateMachine";
import { ClearAvailablePlayersToSomethingFromCommand } from "../commands/ClearAvailablePlayersToSomethingFromCommand";

export function clearAvailablePlayersToSomethingFrom({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailablePlayersToSomethingFromCommand());
}
