import { InputType } from "../BaseGameStateMachine";
import { MoveRobberCommand } from "../commands/MoveRobberCommand";
import { MoveRobberEvent } from "../events";

export function moveRobber({ event, context }: InputType) {
  const e = event as MoveRobberEvent;
  context.dispatcher.dispatch(new MoveRobberCommand(), e.payload);
}
