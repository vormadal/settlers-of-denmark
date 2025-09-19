import { InputType } from '../BaseGameStateMachine';

export function guard(...guards: ((input: InputType) => boolean)[]) {
  return (input: InputType) => {
    return guards.every((guard) => guard(input));
  };
}
