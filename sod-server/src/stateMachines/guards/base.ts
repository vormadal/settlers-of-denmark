import { InputType } from '../BaseGameStateMachine'

function guard(...guards: ((input: InputType) => boolean)[]) {
  return (input: InputType) => {
    return guards.every((guard) => guard(input))
  }
}

function isPlayerTurn({ context, event }: InputType) {
  return (event as any)?.payload?.playerId === context.gameState.currentPlayer
}

function initialRoundIsComplete({ context }: InputType) {
  const players = Array.from(context.gameState.players.values())
  const playersWithMissingRoad = players.filter((player) => player.roads.filter((road) => road.edge).length < 2)
  // we perform the guard before the last road is placed
  // therefore we need to check if there is only one player left
  return playersWithMissingRoad.length === 1
}

export { guard, initialRoundIsComplete, isPlayerTurn }
