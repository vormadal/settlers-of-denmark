import { Group, RegularPolygon } from 'react-konva'
import { Hex } from '../state/Hex'
import { colors } from '../utils/colors'
import NumberToken from './NumberToken'

interface Type {
  tile: Hex
  isHighlighted?: boolean
  onClick?: () => void
}

export function Land({ tile, isHighlighted = false, onClick }: Type) {
  const color = colors[tile.type] ?? '#ff0000'
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Group
      onClick={handleClick}
      onTap={handleClick}
    >
      <RegularPolygon
        radius={tile.radius}
        sides={6}
        rotation={90}
        x={tile.position.x}
        y={tile.position.y}
        stroke="#000000"
        strokeWidth={1.5}
        fill={color}
        opacity={1}
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
