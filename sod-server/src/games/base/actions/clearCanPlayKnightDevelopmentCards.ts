import { InputType } from "../BaseGameStateMachine";
import { ClearCanPlayKnightDevelopmentCardsCommand } from "../commands/ClearCanPlayKnightDevelopmentCardsCommand";

export function clearCanPlayKnightDevelopmentCards({ context }: InputType) {
  context.dispatcher.dispatch(
    new ClearCanPlayKnightDevelopmentCardsCommand()
  );
}