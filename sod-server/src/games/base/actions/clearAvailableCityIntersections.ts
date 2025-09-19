import { InputType } from "../BaseGameStateMachine";
import { ClearAvailableCityIntersectionsCommand } from "../commands/ClearAvailableCityIntersectionsCommand";

export function clearAvailableCityIntersections({ context }: InputType) {
  context.dispatcher.dispatch(new ClearAvailableCityIntersectionsCommand());
}
