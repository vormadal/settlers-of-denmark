import { Circle, Group, Text } from 'react-konva'
import { Hex } from '../state/Hex'

interface Props {
  hex: Hex
  isMoveable?: boolean
  onMove?: (hexId: string) => void
}

export function RobberShape({ hex, isMoveable = false, onMove }: Props) {
  const handleClick = () => {
    if (isMoveable && onMove) {
      onMove(hex.id)
    }
  }

  // Offset the robber so it's positioned to the side of the number token
  // This keeps it visually connected but doesn't cover the number
  const robberOffsetX = 25 // Position to the right of center
  const robberOffsetY = -10 // Slightly above center

  return (
    <Group
      x={hex.position.x}
      y={hex.position.y}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Robber base circle */}
      <Circle
        x={robberOffsetX}
        y={robberOffsetY}
        radius={15}
        fill="#333333"
        stroke="#000000"
        strokeWidth={2}
        shadowColor="#000000"
        shadowBlur={5}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.8}
        opacity={isMoveable ? 0.8 : 1}
      />
      
      {/* Robber symbol */}
      <Text
        x={robberOffsetX}
        y={robberOffsetY}
        text="🏴‍☠️"
        fontSize={12}
        fontFamily="Arial"
        fill="#FFFFFF"
        align="center"
        verticalAlign="middle"
        offsetX={6}
        offsetY={6}
      />
      
      {/* Connection line to show the robber is affecting this hex */}
      <Circle
        x={robberOffsetX}
        y={robberOffsetY}
        radius={18}
        stroke="rgba(51, 51, 51, 0.4)"
        strokeWidth={1}
        dash={[3, 3]}
        fill="transparent"
      />
      
      {/* Hover effect for moveable robber */}
      {isMoveable && (
        <Circle
          x={robberOffsetX}
          y={robberOffsetY}
          radius={20}
          fill="rgba(244, 67, 54, 0.3)"
          stroke="#f44336"
          strokeWidth={2}
          dash={[5, 5]}
          opacity={0}
          onMouseEnter={(e) => {
            e.target.opacity(0.8)
            document.body.style.cursor = 'pointer'
          }}
          onMouseLeave={(e) => {
            e.target.opacity(0)
            document.body.style.cursor = 'default'
          }}
        />
      )}
    </Group>
  )
}