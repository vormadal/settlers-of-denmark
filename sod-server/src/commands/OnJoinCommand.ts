// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { MyRoom } from "../rooms/MyRoom";
import { GameStates } from "../rooms/schema/GameState";

export class OnJoinCommand extends Command<
  MyRoom,
  {
    sessionId: string;
  }
> {
  execute(
    payload: this["payload"]
  ):
    | Array<Command>
    | Command
    | void
    | Promise<Array<Command>>
    | Promise<Command>
    | Promise<unknown> {
    const player = this.room.map.addPlayer(payload.sessionId);
    this.state.players.set(player.id, player.state);
    console.log("player joined", payload.sessionId);
    if (this.room.maxClients == this.room.clients.length) {
      this.state.gameState = GameStates.InProgress;
    }
  }
}
