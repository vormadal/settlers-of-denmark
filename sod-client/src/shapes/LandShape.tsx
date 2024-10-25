import { Circle, Group, RegularPolygon, Text } from 'react-konva'
import { LandTiles } from '../state/LandTiles'

interface Type {
  tile: LandTiles
}

const colors: { [key: string]: string } = {
  Dessert: '#d9bf65',
  Forrest: '#008000',
  Mountains: '#708090',
  Lifestock: '#adff2f',
  Mine: '#d2691e',
  Grain: '#ffdf00'
}

export function Land({ tile }: Type) {
  const color = colors[tile.type] ?? '#ff0000'
  return (
    <Group>
      <RegularPolygon
        radius={tile.radius}
        sides={6}
        rotation={90}
        x={tile.position.x}
        y={tile.position.y}
        stroke={'#000000'}
        strokeWidth={1.5}
        fill={color}
      />

      <Circle
        radius={20}
        fill={'#ffffff'}
        x={tile.position.x}
        y={tile.position.y}
        opacity={0.6}
      />
      <Circle
        radius={20}
        stroke={'#000000'}
        strokeWidth={2}
        x={tile.position.x}
        y={tile.position.y}
      />

      <Text
        text={tile.value.toString()}
        fontSize={18}
        align="center"
        verticalAlign="middle"
        width={50}
        height={50}
        x={tile.position.x - 50 / 2}
        y={tile.position.y - 50 / 2}
        // scale={{ x: 0.01, y: 0.01 }}
        // offsetX={10}
        // offsetY={7}
      />
    </Group>
  )
}
