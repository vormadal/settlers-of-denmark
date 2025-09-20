import { InputType } from "../BaseGameStateMachine";
import { ClearAvailableHexesCommand } from "../commands/ClearAvailableHexesCommand";

export function clearAvailableHexes({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableHexesCommand());
}
