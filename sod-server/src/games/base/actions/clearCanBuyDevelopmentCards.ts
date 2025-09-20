import { InputType } from "../BaseGameStateMachine";
import { ClearCanBuyDevelopmentCardsCommand } from "../commands/ClearCanBuyDevelopmentCardsCommand";

export function clearCanBuyDevelopmentCards({ context }: InputType) {
  context.dispatcher.dispatch(
    new ClearCanBuyDevelopmentCardsCommand()
  );
}
