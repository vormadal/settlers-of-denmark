import { InputType } from "../BaseGameStateMachine";
import { SetCanBuyDevelopmentCardsCommand } from "../commands/SetCanBuyDevelopmentCardsCommand";

export function setCanBuyDevelopmentCards({ context }: InputType) {
  context.dispatcher.dispatch(
    new SetCanBuyDevelopmentCardsCommand(),
    { initialPlacement: context.gameState.round < 3 }
  );
}
