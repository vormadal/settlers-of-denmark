import { InputType } from "../BaseGameStateMachine";
import { SetAvailableRoadEdgesCommand } from "../commands/SetAvailableRoadEdgesCommand";

export function setAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableRoadEdgesCommand(), {
    initialPlacement: context.gameState.round < 3,
  });
}
