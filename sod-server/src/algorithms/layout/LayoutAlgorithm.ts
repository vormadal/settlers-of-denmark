import { GameState } from "../../rooms/schema/GameState";
import { NumberProvider } from "../NumberProvider";
import { TileTypeProvider } from "../TileTypeProvider";

export interface LayoutAlgorithm {
  createLayout(
    state: GameState,
    tileTypeProvider: TileTypeProvider,
    numberProvider: NumberProvider
  ): void;
}
