import { InputType } from "../BaseGameStateMachine";
import { ClearAvailablePlayersToStealFromCommand } from "../commands/ClearAvailablePlayersToStealFromCommand";

export function clearAvailablePlayersToStealFrom({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailablePlayersToStealFromCommand());
}
