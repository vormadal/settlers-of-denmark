import { InputType } from "../BaseGameStateMachine";
import { NextPlayerCommand } from "../commands/NextPlayerCommand";

export function nextPlayer({ context }: InputType) {
  context.dispatcher.dispatch(new NextPlayerCommand());
}
