import { Group, Line } from 'react-konva'
import { getCenter } from '../geometry/geometryUtils'
import { Hex } from '../state/Hex'
import { colors } from '../utils/colors'
import NumberToken from './NumberToken'

interface Type {
  hex: Hex
  isHighlighted?: boolean
  onClick?: () => void
}

export function Land({ hex, isHighlighted = false, onClick }: Type) {
  const color = colors[hex.type] ?? '#ff0000'

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const center = getCenter(hex.intersections.map(x => x.position))
  return (
    <Group
      onClick={handleClick}
      onTap={handleClick}
    >
      <Line points={[...hex.intersections].flatMap(intersection => [intersection.position.x, intersection.position.y])}
        closed={true}
        stroke={isHighlighted ? '#ffff00' : '#000000'}
        strokeWidth={isHighlighted ? 3 : 1.5}
        fill={color} />

      {hex.value !== undefined && (
        <NumberToken
          value={hex.value}
          position={center}
        />
      )}
    </Group>
  )
}
