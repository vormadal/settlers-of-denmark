import { InputType } from '../BaseGameStateMachine';

export function isPlayerTurn({ context, event }: InputType) {
  return (event as any)?.payload?.playerId === context.gameState.currentPlayer;
}
