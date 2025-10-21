import { useRef, useState } from 'react'
import { Group, Line } from 'react-konva'
import { Group as GroupType } from 'konva/lib/Group'
import { Intersection } from '../state/Intersection'
import { usePulseAnimation } from '../utils/konvaAnimations'
import { BaseSettlementShape } from './BaseSettlementShape'

interface Props {
  intersection: Intersection
  color: string
  isUpgradable?: boolean
  onUpgrade?: (intersectionId: string) => void
}

// Simple triangular arrow points like in the image
const leftArrowPoints = [-6, -18, -12, -28, -18, -18]
const centerArrowPoints = [-4, -20, 0, -30, 4, -20]
const rightArrowPoints = [6, -18, 12, -28, 18, -18]

export function SettlementShape({ intersection, color = '#000000', isUpgradable = false, onUpgrade }: Props) {
  const [focus, setFocus] = useState(false)
  const groupRef = useRef<GroupType>(null)

  usePulseAnimation(groupRef, {
    enabled: isUpgradable && !focus,
    period: 2000,
    scaleAmplitude: 0.1,
    defaultScale: focus ? 1.1 : 1.0
  })

  function handleUpgradeClick() {
    if (onUpgrade) {
      onUpgrade(intersection.id)
    }
  }

  function handleMouseEnter() {
    setFocus(true)
  }

  function handleMouseLeave() {
    setFocus(false)
  }

  return (
    <Group ref={groupRef} x={intersection.position.x} y={intersection.position.y}>
      <BaseSettlementShape
        fillColor={color}
        borderColor="#000000"
        onClick={isUpgradable ? handleUpgradeClick : undefined}
        onTouchEnd={isUpgradable ? handleUpgradeClick : undefined}
        onMouseEnter={isUpgradable ? handleMouseEnter : undefined}
        onMouseLeave={isUpgradable ? handleMouseLeave : undefined}
      />
      {isUpgradable && (
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