import { InputType } from "../BaseGameStateMachine";
import { ProduceInitialResourcesCommand } from "../commands/ProduceInitialResourcesCommand";
import { PlaceSettlementEvent } from "../events";

export function produceInitialResources({ context, event }: InputType) {
  const e = event as PlaceSettlementEvent;
  context.dispatcher.dispatch(new ProduceInitialResourcesCommand(), e.payload);
}
