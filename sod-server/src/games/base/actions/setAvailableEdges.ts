import { InputType } from "../BaseGameStateMachine";
import { SetAvailableEdgesCommand } from "../commands/SetAvailableRoadEdgesCommand";

export function setAvailableEdges({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableEdgesCommand(), {
    initialPlacement: context.gameState.round < 3,
  });
}
