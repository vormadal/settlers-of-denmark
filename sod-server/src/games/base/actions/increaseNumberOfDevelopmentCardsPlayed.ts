import { InputType } from "../BaseGameStateMachine";
import { IncreaseNumberOfDevelopmentCardsPlayedCommand } from "../commands/IncreaseNumberOfDevelopmentCardsPlayedCommand";
import { BaseEvent } from "../events";

export function increaseNumberOfDevelopmentCardsPlayed({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new IncreaseNumberOfDevelopmentCardsPlayedCommand(), e.payload);
}