import { InputType } from "../BaseGameStateMachine";
import { DiscardResourcesCommand } from "../commands/DiscardResourcesCommand";
import { DiscardResourcesEvent } from "../events";

export function discardResources({ event, context }: InputType) {
  const e = event as DiscardResourcesEvent;
  context.dispatcher.dispatch(new DiscardResourcesCommand(), e.payload);
}