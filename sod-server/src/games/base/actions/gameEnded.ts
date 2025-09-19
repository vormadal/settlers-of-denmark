import { InputType } from "../BaseGameStateMachine";
import { GameEndedCommand } from "../commands/GameEndedCommand";

export function gameEnded({ context }: InputType) {
  context.dispatcher.dispatch(new GameEndedCommand());
}
