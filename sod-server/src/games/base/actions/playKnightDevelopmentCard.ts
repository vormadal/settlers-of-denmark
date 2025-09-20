import { InputType } from "../BaseGameStateMachine";
import { PlayKnightDevelopmentCardCommand } from "../commands/PlayKnightDevelopmentCardCommand";
import { PlayDevelopmentCardEvent } from "../events";

export function playKnightDevelopmentCard({ context, event }: InputType) {
  const e = event as PlayDevelopmentCardEvent;
  context.dispatcher.dispatch(new PlayKnightDevelopmentCardCommand(), e.payload);
}