import { InputType } from "../BaseGameStateMachine";
import { PlayYearOfPlentyDevelopmentCardCommand } from "../commands/PlayYearOfPlentyDevelopmentCardCommand";
import { PlayDevelopmentCardEvent } from "../events";

export function playYearOfPlentyDevelopmentCard({ context, event }: InputType) {
  const e = event as PlayDevelopmentCardEvent;
  context.dispatcher.dispatch(new PlayYearOfPlentyDevelopmentCardCommand(), e.payload);
}