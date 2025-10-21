import { KonvaEventObject } from 'konva/lib/Node'
import { useRef, useState } from 'react'
import { Group, Line } from 'react-konva'
import { Group as GroupType } from 'konva/lib/Group'
import { Intersection } from '../state/Intersection'
import { usePulseAnimation } from '../utils/konvaAnimations'

interface Props {
  intersection: Intersection
  color: string
  isUpgradable?: boolean
  onUpgrade?: (intersectionId: string) => void
}

const points = [10, 10, -10, 10, -10, -5, 0, -15, 10, -5]
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

  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true)
  }

  function handleMouseLeave() {
    setFocus(false)
  }



  return (
    <Group ref={groupRef}
      x={intersection.position.x}
      y={intersection.position.y}
      onClick={isUpgradable ? handleUpgradeClick : undefined}
      onTouchEnd={isUpgradable ? handleUpgradeClick : undefined}
      onMouseEnter={isUpgradable ? handleMouseEnter : undefined}
      onMouseLeave={isUpgradable ? handleMouseLeave : undefined}>
      <Line
        points={points}
        closed={true}
        shadowEnabled={true}
        shadowColor="#000000"
        shadowOffsetX={2}
        shadowBlur={5}
        shadowOpacity={0.6}
        strokeWidth={1.1}
        stroke={'#000000'}
        fill={color}
      />
      {isUpgradable && (
        <>
          <UpgradeArrow points={leftArrowPoints} />
          <UpgradeArrow points={centerArrowPoints} />
          <UpgradeArrow points={rightArrowPoints} />
        </>
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