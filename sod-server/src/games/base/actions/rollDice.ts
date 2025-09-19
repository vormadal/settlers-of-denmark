import { InputType } from "../BaseGameStateMachine";
import { RollDiceCommand } from "../commands/RollDiceCommand";

export function rollDice({ context }: InputType) {
  context.dispatcher.dispatch(new RollDiceCommand());
}
