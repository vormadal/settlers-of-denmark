// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { MyRoom } from "../rooms/MyRoom";
import { GameStates } from "../rooms/schema/MyRoomState";

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
    this.state.players.push(player.state);
    console.log("player joined", payload.sessionId);
    if (this.room.maxClients == this.room.clients.length) {
      this.state.state = GameStates.WaitingForPlayers;
      console.log('starting game...')
    }

    
  }
}
