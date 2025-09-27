import { InputType } from "../BaseGameStateMachine";
import { ClearCurrentDevelopmentCardIdCommand } from "../commands/ClearCurrentDevelopmentCardIdCommand";

export function clearCurrentDevelopmentCardId({ context }: InputType) {
  context.dispatcher.dispatch(
    new ClearCurrentDevelopmentCardIdCommand()
  );
}
