import { InputType } from '../BaseGameStateMachine';

export function noPlayersTooRich({ context }: InputType) {
    console.log(`noPlayersTooRich: Checking...`);
    return context.gameState.availablePlayersToSomethingFrom.length === 0;
}