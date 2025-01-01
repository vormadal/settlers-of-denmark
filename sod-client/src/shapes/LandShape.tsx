import { Group, RegularPolygon } from 'react-konva'
import { Hex } from '../state/Hex'
import { colors } from '../utils/colors'
import NumberToken from './NumberToken'

interface Type {
  tile: Hex
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

      {tile.value !== undefined && (
        <NumberToken
          value={tile.value}
          position={tile.position}
        />
      )}
    </Group>
  )
}
