import { InputType } from "../BaseGameStateMachine";
import { PlaceSettlementCommand } from "../commands/PlaceSettlementCommand";
import { PlaceSettlementEvent } from "../events";

export function buySettlement({ event, context }: InputType) {
  const e = event as PlaceSettlementEvent;
  context.dispatcher.dispatch(new PlaceSettlementCommand(), e.payload);
}
