import { BaseGameTileTypes } from "../models/LandTiles";

export interface TileTypeProvider {
  setup(totalCount: number): void;
  nextType(): string;
}

export class RandomTileTypeProvider implements TileTypeProvider {
  constructor(private readonly availableTypes: string[]) {}

  setup(totalCount: number): void {}

  nextType(): string {
    const index = Math.round(Math.random() * this.availableTypes.length);
    return this.availableTypes[index];
  }
}

export class PercentageTileTypeProvider implements TileTypeProvider {
  availableTiles: string[] = [];
  constructor(private readonly tileDistribution: { [key: string]: number }) {
    const values = Object.values(tileDistribution);
    const total = values.reduce((v, percentage) => {
      return v + percentage;
    }, 0);
    if (Math.round(total) !== 100) {
      throw new Error(
        "distribution should sum up to 100 actual value was " + total
      );
    }
  }

  setup(totalCount: number): void {
    this.availableTiles = [];
    const keys = Object.keys(this.tileDistribution);
    let sum = 0;
    for (let i = 0; i < keys.length; i++) {
      const type = keys[i];
      const distribution = this.tileDistribution[type];
      let count = Math.round((totalCount * distribution) / 100);
      if (i >= keys.length - 1) {
        count = totalCount - sum;
      }

      for (let j = 0; j < count; j++) {
        this.availableTiles.push(type);
      }

      sum += count;
    }
  }

  nextType(): string {
    const index = Math.round(Math.random() * this.availableTiles.length);
    const type = this.availableTiles.splice(index, 1)[0];

    return type ?? BaseGameTileTypes.Dessert;
  }
}
