import { InputType } from "../BaseGameStateMachine";
import { SetAvailableHexesForRobberCommand } from "../commands/SetAvailableHexesForRobberCommand";
import { SetAvailableEdgesCommand } from "../commands/SetAvailableRoadEdgesCommand";

export function setAvailableHexesForRobber({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableHexesForRobberCommand());
}
