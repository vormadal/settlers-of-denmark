import { InputType } from "../BaseGameStateMachine";
import { ProduceResourcesCommand } from "../commands/ProduceResourcesCommand";

export function produceResources({ context }: InputType) {
  context.dispatcher.dispatch(new ProduceResourcesCommand());
}
