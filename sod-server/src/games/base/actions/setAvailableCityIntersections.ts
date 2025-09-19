import { InputType } from "../BaseGameStateMachine";
import { SetAvailableCityIntersectionsCommand } from "../commands/SetAvailableCityIntersectionsCommand";

export function setAvailableCityIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new SetAvailableCityIntersectionsCommand(), {
    initialPlacement: context.gameState.round < 3,
  });
}
