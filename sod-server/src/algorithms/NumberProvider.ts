
export interface NumberProvider {
  setup(totalCount: number): void;
  next(): string;
}

export class RandomTileTypeProvider implements NumberProvider {
  constructor(private readonly availableTypes: string[]) {}

  setup(totalCount: number): void {}

  next(): string {
    const index = Math.round(Math.random() * this.availableTypes.length);
    return this.availableTypes[index];
  }
}

