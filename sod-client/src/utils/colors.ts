export const colors: { [key: string]: string } = {
  // tiles
  Dessert: '#d9bf65',
  Forest: '#008000',
  Mountains: '#708090',
  Pastures: '#adff2f',
  Hills: '#d2691e',
  Fields: '#ffdf00',
  // resources
  Lumber: '#008000',
  Wool: '#adff2f',
  Grain: '#ffdf00',
  Ore: '#708090',
  Brick: '#d2691e'
}

export function getUniqueColor(n: number, brightness = 160) {
  const rgb = [0, 0, 0]
  for (let i = 0; i < 24; i++) {
    rgb[i % 3] <<= 1
    rgb[i % 3] |= n & 0x01
    n >>= 1
  }
  console.log(rgb)
  return (
    '#' +
    rgb
      .map((x) => (x + brightness > 255 ? 255 : x + brightness))
      .reduce((a, c) => (c > 0x0f ? c.toString(16) : '0' + c.toString(16)) + a, '')
  )
}
