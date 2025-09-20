import { InputType } from "../BaseGameStateMachine";
import { BuyDevelopmentCardCommand } from "../commands/BuyDevelopmentCardCommand";
import { BuyDevelopmentCardEvent } from "../events/BuyDevelopmentCardEvent";

export function buyDevelopmentCard({ event, context }: InputType) {
  const e = event as BuyDevelopmentCardEvent;
  context.dispatcher.dispatch(new BuyDevelopmentCardCommand(), e.payload);
}
