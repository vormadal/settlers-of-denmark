import { DieTypes } from '../../../rooms/schema/Die';
import { InputType } from '../BaseGameStateMachine';

export function isDieCastSeven({ context }: InputType) {
    const diceRoll = context.gameState.dice
          .filter((x) => x.type === DieTypes.Regular)
          .reduce((sum, die) => sum + die.value, 0);
          
    return diceRoll === 7;
}
