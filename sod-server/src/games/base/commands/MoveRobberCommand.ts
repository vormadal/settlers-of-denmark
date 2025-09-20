import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

interface Payload {
  hexId: string;
  playerId: string;
}

export class MoveRobberCommand extends Command<MyRoom, Payload> {
  execute(payload: Payload) {
    this.state.robberHex = payload.hexId
  }
}
