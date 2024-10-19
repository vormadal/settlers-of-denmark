export interface NumberProvider {
  next(): number;
}

export class RandomNumberProvider implements NumberProvider {
  next(): number {
    return Math.round(Math.random() * 12);
  }
}
