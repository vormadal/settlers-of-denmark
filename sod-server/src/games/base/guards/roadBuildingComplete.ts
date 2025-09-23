import { InputType } from '../BaseGameStateMachine';

export function roadBuildingComplete({ context }: InputType) {
  return context.gameState.roadBuildingDevelopmentCardPhase > 0;
}
