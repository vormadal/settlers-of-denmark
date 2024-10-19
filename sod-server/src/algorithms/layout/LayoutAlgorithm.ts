import { GameMap } from "../../models/GameMap";
import { NumberProvider } from "../NumberProvider";
import { TileTypeProvider } from "../TileTypeProvider";

export interface LayoutAlgorithm {
  createLayout(
    map: GameMap,
    tileTypeProvider: TileTypeProvider,
    numberProvider: NumberProvider
  ): void;
}
