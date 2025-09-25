import { Command } from "@colyseus/command";
import { MyRoom } from "../../../rooms/MyRoom";

export class IncreaseRoadBuildingPhaseCommand extends Command<MyRoom> {
  execute() {
    this.room.state.roadBuildingDevelopmentCardPhase += 1;
  }
}
