import { Circle, Group, Text } from 'react-konva'
import { getCenter } from '../geometry/geometryUtils'
import { Hex } from '../state/Hex'

interface Props {
  hex: Hex
  isMoveable?: boolean
}

export function RobberShape({ hex, isMoveable = false }: Props) {

  // Offset the robber so it's positioned to the side of the number token
  // This keeps it visually connected but doesn't cover the number
  const robberOffsetX = 30 // Position further to the right of center
  const robberOffsetY = -15 // Higher above center to avoid number overlap

  const center = getCenter(hex.intersections.map(x => x.position))
  return (
    <Group
      x={center.x}
      y={center.y}
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


    </Group>
  )
}