import { InputType } from "../BaseGameStateMachine";
import { IncreaseRoadBuildingPhaseCommand } from "../commands/IncreaseRoadBuildingPhaseCommand";

export function increaseRoadBuildingPhase({ event, context }: InputType) {
  context.dispatcher.dispatch(new IncreaseRoadBuildingPhaseCommand());
}