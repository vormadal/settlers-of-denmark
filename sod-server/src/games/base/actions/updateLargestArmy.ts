import { InputType } from "../BaseGameStateMachine";
import { UpdateLargestArmyCommand } from "../commands/UpdateLargestArmyCommand";
import { UpdatePlayerVictoryPointsCommand } from "../commands/UpdatePlayerVictoryPointsCommand";
import { BaseEvent } from "../events";

export function updateLargestArmy({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new UpdateLargestArmyCommand(), {
    playerId: e.payload.playerId,
  });
}
