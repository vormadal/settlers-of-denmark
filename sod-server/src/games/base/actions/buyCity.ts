import { InputType } from "../BaseGameStateMachine";
import { PlaceCityCommand } from "../commands/PlaceCityCommand";
import { PlaceCityEvent } from "../events";

export function buyCity({ event, context }: InputType) {
  const e = event as PlaceCityEvent;
  context.dispatcher.dispatch(new PlaceCityCommand(), e.payload);
}
