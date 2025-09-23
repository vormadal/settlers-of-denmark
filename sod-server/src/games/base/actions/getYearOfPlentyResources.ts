import { InputType } from "../BaseGameStateMachine";
import { GetYearOfPlentyResourcesCommand } from "../commands/GetYearOfPlentyResourcesCommand";
import { SelectYearOfPlentyResources } from "../events/SelectYearOfPlentyResources";

export function getYearOfPlentyResources({ event, context }: InputType) {
  const e = event as SelectYearOfPlentyResources;
  context.dispatcher.dispatch(new GetYearOfPlentyResourcesCommand(), e.payload);
}