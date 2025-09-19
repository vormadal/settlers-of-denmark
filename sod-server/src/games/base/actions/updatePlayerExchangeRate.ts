import { InputType } from "../BaseGameStateMachine";
import { UpdatePlayerExchangeRateCommand } from "../commands/UpdatePlayerExchangeRateCommand";
import { BaseEvent } from "../events";

export function updatePlayerExchangeRate({ event, context }: InputType) {
  const e = event as BaseEvent;
  context.dispatcher.dispatch(new UpdatePlayerExchangeRateCommand(), {
    playerId: e.payload.playerId,
  });
}
