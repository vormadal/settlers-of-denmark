export const colors: { [key: string]: string } = {
  // tiles
  Desert: '#d9bf65',
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

const playerColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6']
export function getUniqueColor(n: number) {
  return playerColors[n % playerColors.length]
}
