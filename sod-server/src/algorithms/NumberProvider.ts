export interface NumberProvider {
  next(): number
}

export class RandomNumberProvider implements NumberProvider {
  values = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]
  next(): number {
    return this.values[Math.round(Math.random() * (this.values.length - 1))]
  }
}

export class BalancedNumberProvider implements NumberProvider {
  values: number[]
  index = 0
  constructor() {
    this.values = shuffleArray([2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12])
  }
  next(): number {
    return this.values[this.index++ % this.values.length]
  }
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
