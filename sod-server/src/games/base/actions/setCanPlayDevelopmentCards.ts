import { InputType } from "../BaseGameStateMachine";
import { SetCanPlayDevelopmentCardsCommand } from "../commands/SetCanPlayDevelopmentCardsCommand";
import { BaseEvent } from "../events";

export function setCanPlayDevelopmentCards({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new SetCanPlayDevelopmentCardsCommand(), e.payload);
}
