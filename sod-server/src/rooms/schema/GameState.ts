import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTile";
import { Player } from "./Player";
import { Road } from "./Road";

export class GameState extends Schema {
  @type([BorderEdge]) edges = new ArraySchema<BorderEdge>();
  @type([Intersection]) intersections = new ArraySchema<Intersection>();
  @type([LandTiles]) landTiles = new ArraySchema<LandTiles>();
  @type({ map: Player }) players = new MapSchema<Player>();
  
  @type("string") gameState: string = GameStates.WaitingForPlayers;

  @type("string") currentPlayer: string = "";
}

export const GameStates = {
  WaitingForPlayers: "waiting_for_players",
  InProgress: "in_progress",
  Ended: "ended",
};
