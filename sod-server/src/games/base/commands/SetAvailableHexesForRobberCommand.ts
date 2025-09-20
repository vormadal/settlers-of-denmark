import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'
import { HexTypes } from '../../../rooms/schema/Hex'
import { ArraySchema } from '@colyseus/schema';

export class SetAvailableHexesForRobberCommand extends Command<MyRoom> {
  execute() {
    const hexes = this.state.hexes.filter(h => h.id !== this.state.robberHex && h.type !== HexTypes.Dessert);
    this.state.availableHexes = new ArraySchema<string>(...hexes.map(h => h.id));
  }
}
