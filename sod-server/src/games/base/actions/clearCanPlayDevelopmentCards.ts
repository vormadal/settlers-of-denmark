import { InputType } from "../BaseGameStateMachine";
import { ClearCanPlayDevelopmentCardsCommand } from "../commands/ClearCanplayDevelopmentCardsCommand";

export function clearCanPlayDevelopmentCards({ context }: InputType) {
  context.dispatcher.dispatch(
    new ClearCanPlayDevelopmentCardsCommand()
  );
}
