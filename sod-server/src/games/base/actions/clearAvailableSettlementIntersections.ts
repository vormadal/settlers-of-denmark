import { InputType } from "../BaseGameStateMachine";
import { ClearAvailableSettlementIntersectionsCommand } from "../commands/ClearAvailableSettlementIntersectionsCommand";

export function clearAvailableSettlementIntersections({ context }: InputType) {
  context.dispatcher.dispatch(
    new ClearAvailableSettlementIntersectionsCommand()
  );
}
