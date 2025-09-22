import { InputType } from "../BaseGameStateMachine";
import { PlayMonopolyDevelopmentCardCommand } from "../commands/PlayMonopolyDevelopmentCardCommand";
import { PlayDevelopmentCardEvent } from "../events";

export function playMonopolyDevelopmentCard({ context, event }: InputType) {
  const e = event as PlayDevelopmentCardEvent;
  context.dispatcher.dispatch(new PlayMonopolyDevelopmentCardCommand(), e.payload);
}