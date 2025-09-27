import { InputType } from '../BaseGameStateMachine';

export function hasDiceBeenRolled({ context }: InputType) {
    return context.gameState.hasDiceBeenRolled;
}
