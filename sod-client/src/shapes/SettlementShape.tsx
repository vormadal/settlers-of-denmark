import { Group as GroupType } from 'konva/lib/Group'
import { useRef, useState } from 'react'
import { Group, Line } from 'react-konva'
import Point from '../geometry/Point'
import { usePulseAnimation } from '../utils/konvaAnimations'
import { BaseSettlementShape } from './BaseSettlementShape'

interface Props {
  position: Point
  color: string
  showUpgradeAnimation?: boolean
  onClick?: () => void
}

// Simple triangular arrow points like in the image
const leftArrowPoints = [-6, -18, -12, -28, -18, -18]
const centerArrowPoints = [-4, -20, 0, -30, 4, -20]
const rightArrowPoints = [6, -18, 12, -28, 18, -18]

export function SettlementShape({ position, color = '#000000', showUpgradeAnimation = false, onClick }: Props) {
  const [focus, setFocus] = useState(false)
  const groupRef = useRef<GroupType>(null)

  usePulseAnimation(groupRef, {
    enabled: showUpgradeAnimation && !focus,
    period: 2000,
    scaleAmplitude: 0.1,
    defaultScale: focus ? 1.1 : 1.0
  })

  function handleMouseEnter() {
    setFocus(true)
  }

  function handleMouseLeave() {
    setFocus(false)
  }

  return (
    <Group ref={groupRef} x={position.x} y={position.y}>
      <BaseSettlementShape
        fillColor={color}
        borderColor="#000000"
        onClick={onClick}
        onTouchEnd={onClick}
        onMouseEnter={showUpgradeAnimation ? handleMouseEnter : undefined}
        onMouseLeave={showUpgradeAnimation ? handleMouseLeave : undefined}
      />
      {showUpgradeAnimation && (
        <Group>
          <UpgradeArrow points={leftArrowPoints} />
          <UpgradeArrow points={centerArrowPoints} />
          <UpgradeArrow points={rightArrowPoints} />
        </Group>
      )}
    </Group>
  )
}


function UpgradeArrow({ points }: { points: number[] }) {
  return <Line
    points={points}
    closed={true}
    fill="#8BC34A"
    stroke="#689F38"
    strokeWidth={2}
    opacity={1}
    shadowEnabled={true}
    shadowColor="#000000"
    shadowOffsetX={1}
    shadowBlur={3}
    shadowOpacity={0.4}
  />
}