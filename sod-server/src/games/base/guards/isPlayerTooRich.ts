import { Card, CardTypes } from "../../../rooms/schema/Card";
import { InputType } from "../BaseGameStateMachine";

export function isPlayerTooRich({ context, event }: InputType) {
  const playerId = (event as any)?.payload?.playerId;
  const player = context.gameState.players.get(playerId);
  const resourceCards =
        player
      ?.cards(context.gameState)
      .filter((card) => card.type === CardTypes.Resource) || [];
    const tooRich = resourceCards.length > 7;
    console.log(`isPlayerTooRich: Player ${playerId} has ${resourceCards.length} resource cards. Too rich: ${tooRich}`);
  return tooRich;
}
