import { InputType } from "../BaseGameStateMachine";
import { SetAvailableSettlementIntersectionsCommand } from "../commands/SetAvailableSettlementIntersectionsCommand";

export function setAvailableSettlementIntersections({ context }: InputType) {
  context.dispatcher.dispatch(
    new SetAvailableSettlementIntersectionsCommand(),
    { initialPlacement: context.gameState.round < 3 }
  );
}
