import { InputType } from "../BaseGameStateMachine";
import { UpdatePlayerLongestRoadCommand } from "../commands/UpdatePlayerLongestRoadCommand";
import { BaseEvent } from "../events";

export function updatePlayerLongestRoad({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new UpdatePlayerLongestRoadCommand(), {
    playerId: e.payload.playerId,
  });
}
