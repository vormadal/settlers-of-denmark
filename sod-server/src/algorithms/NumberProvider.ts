export interface NumberProvider {
  next(): number;
}

export class RandomTileTypeProvider implements NumberProvider {
  next(): number {
    return Math.round(Math.random() * 12);
  }
}
