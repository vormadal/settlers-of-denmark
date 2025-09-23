import { InputType } from "../BaseGameStateMachine";
import { PlayRoadBuildingDevelopmentCardCommand } from "../commands/playRoadBuildingDevelopmentCardCommand";
import { PlayDevelopmentCardEvent } from "../events";

export function playRoadBuildingDevelopmentCard({ context, event }: InputType) {
  const e = event as PlayDevelopmentCardEvent;
  context.dispatcher.dispatch(new PlayRoadBuildingDevelopmentCardCommand(), e.payload);
}