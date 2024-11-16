import { Vector } from '../../utils/Vector'
import { HEX_RADIUS, HEX_WIDTH } from './HexLayoutAlgorithm'

import { LayoutAlgorithm } from './LayoutAlgorithm'

export class BasicLayoutAlgorithm implements LayoutAlgorithm {
  constructor(private readonly m: number, private readonly n: number) {}
  createLayout(): Vector[] {
    const positions: Vector[] = []
    for (let i = 0; i < this.m; i++) {
      for (let j = 0; j < this.n; j++) {
        const p1 = CalculatePoint(i, j)
        const p2 = CalculatePointAlt(i, j)
        positions.push(p1, p2)
      }
    }

    return positions
  }
}

function CalculatePoint(m: number, n: number) {
  const x = 3 * m * HEX_RADIUS
  const y = n * HEX_WIDTH
  return new Vector(x, y)
}

function CalculatePointAlt(m: number, n: number) {
  const x = 3 * m * HEX_RADIUS + (3 * HEX_RADIUS) / 2
  const y = (n * HEX_RADIUS + 0.5 * HEX_RADIUS) * Math.sqrt(3)
  return new Vector(x, y)
}
