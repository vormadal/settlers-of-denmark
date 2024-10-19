import { LayoutAlgorithm } from "../algorithms/layout/LayoutAlgorithm";
import { RandomNumberProvider } from "../algorithms/NumberProvider";
import { PercentageTileTypeProvider } from "../algorithms/TileTypeProvider";
import { GameState } from "../rooms/schema/GameState";
import { BorderEdge } from "./BorderEdge";
import { House } from "./House";
import { Intersection } from "./Intersection";
import { BaseGameTileTypes, LandTiles } from "./LandTiles";
import { Player } from "./Player";
import { Road } from "./Road";

export interface GameMapOptions {
  numPlayers: number;
  numHouses: number;
  numCities: number;
  numRoads: number;
}
export class GameMap {
  private readonly _borderEdges: BorderEdge[] = [];
  private readonly _intersections: Intersection[] = [];
  private readonly _landTiles: LandTiles[] = [];
  private readonly _players: Player[] = [];

  options: GameMapOptions;

  private readonly _schema = new GameState();

  constructor(
    public readonly id: string,
    public readonly layoutAlgorithm: LayoutAlgorithm,
    options?: GameMapOptions
  ) {
    this.options = {
      numCities: 4,
      numHouses: 4,
      numPlayers: 2,
      numRoads: 9,
      ...options,
    };

    this._schema = new GameState();

    layoutAlgorithm.createLayout(
      this,
      new PercentageTileTypeProvider({
        [BaseGameTileTypes.Dessert]: (1 / 19) * 100,
        [BaseGameTileTypes.Forrest]: (4 / 19) * 100,
        [BaseGameTileTypes.Grain]: (4 / 19) * 100,
        [BaseGameTileTypes.Lifestock]: (4 / 19) * 100,
        [BaseGameTileTypes.Mountains]: (3 / 19) * 100,
        [BaseGameTileTypes.Mine]: (3 / 19) * 100,
      }),
      new RandomNumberProvider()
    );
  }

  addPlayer(id: string) {
    const player = new Player(id);
    const roads = Array.from(
      { length: this.options.numRoads },
      (_, i) => new Road(`${player.id}-${i}`, player)
    );
    const houses = Array.from(
      { length: this.options.numHouses },
      (_, i) => new House(`${player.id}-${i}`, player)
    );
    player.roads = roads;
    player.houses = houses;
    this._players.push(player);
    this._schema.players.set(player.id, player.schema);

    return player;
  }

  get players() {
    return this._players;
  }

  set borderEdges(edges: BorderEdge[]) {
    this._borderEdges.push(...edges);
    this._schema.edges.push(...edges.map((x) => x.schema));
  }

  get borderEdges() {
    return this._borderEdges;
  }

  set intersections(intersections: Intersection[]) {
    this._intersections.push(...intersections);
    this._schema.intersections.push(...intersections.map((x) => x.schema));
  }

  get intersections() {
    return this._intersections;
  }

  set landTiles(tiles: LandTiles[]) {
    this._landTiles.push(...tiles);
    this._schema.landTiles.push(...tiles.map((x) => x.schema));
  }

  get landTiles() {
    return this._landTiles;
  }

  get schema() {
    return this._schema;
  }
}
