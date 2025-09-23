import { InputType } from "../BaseGameStateMachine";
import { ClearRoadBuildingPhaseCommand } from "../commands/ClearRoadBuildingPhaseCommand";

export function clearRoadBuildingPhase({ event, context }: InputType) {
  context.dispatcher.dispatch(new ClearRoadBuildingPhaseCommand());
}