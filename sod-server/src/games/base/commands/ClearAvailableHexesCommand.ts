import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { ArraySchema } from '@colyseus/schema';

export class ClearAvailableHexesCommand extends Command<MyRoom> {
  execute() {
    this.state.availableHexes = new ArraySchema<string>();
  }
}
