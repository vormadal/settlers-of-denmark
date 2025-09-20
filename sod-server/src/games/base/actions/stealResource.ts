import { InputType } from "../BaseGameStateMachine";
import { StealResourceCommand } from "../commands/StealResourceCommand";
import { UpdateLargestArmyCommand } from "../commands/UpdateLargestArmyCommand";
import { StealResourceEvent } from "../events";

export function stealResource({ event, context }: InputType) {
  const e = event as StealResourceEvent;
  context.dispatcher.dispatch(new StealResourceCommand(), e.payload);
}
