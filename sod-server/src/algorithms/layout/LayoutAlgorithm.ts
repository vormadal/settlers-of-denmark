import { GameMap } from "../../models/GameMap";
import { TileTypeProvider } from "../TileTypeProvider";

export interface LayoutAlgorithm {
  createLayout(tileTypeProvider: TileTypeProvider): GameMap;
}
