import { InputType } from "../BaseGameStateMachine";
import { UpdatePlayerVictoryPointsCommand } from "../commands/UpdatePlayerVictoryPointsCommand";
import { BaseEvent } from "../events";

export function updatePlayerVictoryPoints({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new UpdatePlayerVictoryPointsCommand(), {
    playerId: e.payload.playerId,
  });
}
