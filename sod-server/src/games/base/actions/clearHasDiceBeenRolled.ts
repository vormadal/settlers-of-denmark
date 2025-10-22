import { InputType } from "../BaseGameStateMachine";
import { ClearHasDiceBeenRolledCommand } from "../commands/ClearHasDiceBeenRolledCommand";

export function clearHasDiceBeenRolled({ context }: InputType) {
  context.dispatcher.dispatch(
    new ClearHasDiceBeenRolledCommand()
  );
}