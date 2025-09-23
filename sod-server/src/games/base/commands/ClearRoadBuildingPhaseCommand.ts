import { Command } from '@colyseus/command'
import { MyRoom } from '../../../rooms/MyRoom'

export class ClearRoadBuildingPhaseCommand extends Command<MyRoom> {
  execute() {
    this.room.state.roadBuildingDevelopmentCardPhase = 0;
  }
}