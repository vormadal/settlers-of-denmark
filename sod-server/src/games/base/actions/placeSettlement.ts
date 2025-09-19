import { InputType } from "../BaseGameStateMachine";
import { PlaceInitialSettlementCommand } from "../commands/PlaceInitialSettlementCommand";
import { PlaceSettlementEvent } from "../events";

export function placeSettlement({ event, context }: InputType) {
  const e = event as PlaceSettlementEvent;
  context.dispatcher.dispatch(new PlaceInitialSettlementCommand(), e.payload);
}
