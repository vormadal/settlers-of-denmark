import { InputType } from "../BaseGameStateMachine";
import { IncreaseNumberOfDevelopmentCardsPlayedCommand } from "../commands/IncreaseNumberOfDevelopmentCardsPlayedCommand";

export function increaseNumberOfDevelopmentCardsPlayed({ event, context }: InputType) {
  const e = event as any; //TODO fix type
  context.dispatcher.dispatch(new IncreaseNumberOfDevelopmentCardsPlayedCommand(), e.payload);
}