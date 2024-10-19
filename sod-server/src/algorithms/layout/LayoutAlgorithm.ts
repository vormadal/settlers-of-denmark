import { GameMap } from "../../models/GameMap";
import { TileTypeProvider } from "../TileTypeProvider";

export interface LayoutAlgorithm {
  createLayout(map: GameMap, tileTypeProvider: TileTypeProvider): void;
}
