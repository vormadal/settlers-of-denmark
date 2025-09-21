import { InputType } from "../BaseGameStateMachine";
import { ClearNumberOfDevelopmentCardsPlayedCommand } from "../commands/ClearNumberOfDevelopmentCardsPlayedCommand";
import { BaseEvent } from "../events";

export function clearNumberOfDevelopmentCardsPlayed({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new ClearNumberOfDevelopmentCardsPlayedCommand(), e.payload);
}