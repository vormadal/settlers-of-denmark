import { Command } from '@colyseus/command'
import { ArraySchema } from '@colyseus/schema'
import { MyRoom } from '../../rooms/MyRoom'

export class ClearAvailableSettlementIntersectionsCommand extends Command<MyRoom> {
  execute() {
    this.state.availableSettlementIntersections = new ArraySchema<string>()
  }
}
