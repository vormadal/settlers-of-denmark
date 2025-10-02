import { InputType } from "../BaseGameStateMachine";
import { SetCanPlayDevelopmentCardsCommand } from "../commands/SetCanPlayDevelopmentCardsCommand";
import { SetCanPlayKnightDevelopmentCardsCommand } from "../commands/SetCanPlayKnightDevelopmentCardsCommand";
import { BaseEvent } from "../events";

export function setCanPlayKnightDevelopmentCards({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new SetCanPlayKnightDevelopmentCardsCommand(), e.payload);
}