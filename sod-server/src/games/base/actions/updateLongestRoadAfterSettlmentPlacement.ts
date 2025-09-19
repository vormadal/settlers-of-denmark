import { InputType } from "../BaseGameStateMachine";
import { UpdateLongestRoadAfterSettlementPlacementCommand } from "../commands/UpdateLongestRoadAfterSettlementPlacementCommand";
import { PlaceSettlementEvent } from "../events";

export function updateLongestRoadAfterSettlementPlacement({
  event,
  context,
}: InputType) {
  const e = event as PlaceSettlementEvent;
  context.dispatcher.dispatch(
    new UpdateLongestRoadAfterSettlementPlacementCommand(),
    { playerId: e.payload.playerId, intersectionId: e.payload.intersectionId }
  );
}
