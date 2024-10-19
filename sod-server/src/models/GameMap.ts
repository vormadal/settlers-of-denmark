import { LayoutAlgorithm } from "../algorithms/layout/LayoutAlgorithm";
import { PercentageTileTypeProvider } from "../algorithms/TileTypeProvider";
import { MyRoomState } from "../rooms/schema/MyRoomState";
import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { BaseGameTileTypes, LandTiles } from "./LandTiles";
import { Player } from "./Player";

export interface GameMapOptions {
  numPlayers: number;
  numHouses: number;
  numCities: number;
  numRoads: number;
}
export class GameMap {
  borderEdges: BorderEdge[] = [];
  intersections: Intersection[] = [];
  landTiles: LandTiles[] = [];
  players: Player[] = [];

  options: GameMapOptions;
  constructor(
    public readonly id: string,
    public readonly layoutAlgorithm: LayoutAlgorithm,
    options: GameMapOptions
  ) {
    this.options = {
      numCities: 4,
      numHouses: 4,
      numPlayers: 4,
      numRoads: 9,
      ...options,
    };

    layoutAlgorithm.createLayout(
      this,
      new PercentageTileTypeProvider({
        [BaseGameTileTypes.Dessert]: (1 / 19) * 100,
        [BaseGameTileTypes.Forrest]: (4 / 19) * 100,
        [BaseGameTileTypes.Grain]: (4 / 19) * 100,
        [BaseGameTileTypes.Lifestock]: (4 / 19) * 100,
        [BaseGameTileTypes.Mountains]: (3 / 19) * 100,
        [BaseGameTileTypes.Mine]: (3 / 19) * 100,
      })
    );
  }

  addPlayer(id: string) {
    const player = new Player(id);
    this.players.push(player);
    return player;
  }

  get schema() {
    const state = new MyRoomState();
    state.LandTiles.push(...this.landTiles.map((x) => x.getStateSchema()));
    state.edges.push(...this.borderEdges.map((x) => x.getStateSchema()));
    state.intersections.push(
      ...this.intersections.map((x) => x.getStateSchema())
    );

    return state;
  }
}
