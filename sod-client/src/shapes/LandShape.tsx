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
        stroke={isHighlighted ? '#f44336' : '#000000'}
        strokeWidth={isHighlighted ? 3 : 1.5}
        fill={color}
        opacity={isHighlighted ? 0.8 : 1}
        onMouseEnter={isHighlighted ? (e) => {
          e.target.opacity(0.9)
          document.body.style.cursor = 'pointer'
        } : undefined}
        onMouseLeave={isHighlighted ? (e) => {
          e.target.opacity(0.8)
          document.body.style.cursor = 'default'
        } : undefined}
      />

      {/* Highlight overlay for available hexes */}
      {isHighlighted && (
        <RegularPolygon
          radius={tile.radius - 5}
          sides={6}
          rotation={90}
          x={tile.position.x}
          y={tile.position.y}
          fill="rgba(244, 67, 54, 0.3)"
          stroke="#f44336"
          strokeWidth={2}
          dash={[10, 5]}
          opacity={0.7}
        />
      )}

      {tile.value !== undefined && (
        <NumberToken
          value={tile.value}
          position={tile.position}
        />
      )}
    </Group>
  )
}
