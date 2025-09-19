import { InputType } from "../BaseGameStateMachine";
import { PlaceRoadCommand } from "../commands/PlaceRoadCommand";
import { PlaceRoadEvent } from "../events";

export function buyRoad({ event, context }: InputType) {
  const e = event as PlaceRoadEvent;
  context.dispatcher.dispatch(new PlaceRoadCommand(), e.payload);
}
