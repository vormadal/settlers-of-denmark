import { InputType } from "../BaseGameStateMachine";
import { ClearAvailableEdgesCommand } from "../commands/ClearAvailableEdgesCommand";

export function clearAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableEdgesCommand());
}
