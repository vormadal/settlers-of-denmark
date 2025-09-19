import { InputType } from "../BaseGameStateMachine";
import { UpdateLongestRoadAfterSettlmentPlacementCommand } from "../commands/UpdateLongestRoadAfterSettlmentPlacementCommand";
import { PlaceSettlementEvent } from "../events";

export function updateLongestRoadAfterSettlmentPlacement({
  event,
  context,
}: InputType) {
  const e = event as PlaceSettlementEvent;
  context.dispatcher.dispatch(
    new UpdateLongestRoadAfterSettlmentPlacementCommand(),
    { playerId: e.payload.playerId, intersectionId: e.payload.intersectionId }
  );
}
