import { InputType } from '../BaseGameStateMachine';

export function isGameEnded({ context }: InputType) {
  const players = Array.from(context.gameState.players.values());
  const isGameEnded = players.some(player => (player.victoryPoints + player.secretVictoryPoints) >= context.gameState.victoryPointsToWin);
  return isGameEnded;
}
