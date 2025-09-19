import { InputType } from "../BaseGameStateMachine";
import { PlaceInitialRoadCommand } from "../commands/PlaceInitialRoadCommand";
import { PlaceRoadEvent } from "../events";

export function placeRoad({ event, context }: InputType) {
  const e = event as PlaceRoadEvent;
  context.dispatcher.dispatch(new PlaceInitialRoadCommand(), e.payload);
}
