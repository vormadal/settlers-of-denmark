import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'
import { Group, Line } from 'react-konva'
import { Intersection } from '../state/Intersection'

interface Props {
  intersection: Intersection
  color: string
  isUpgradable?: boolean
  onUpgrade?: (intersectionId: string) => void
}

const points = [10, 10, -10, 10, -10, -5, 0, -15, 10, -5]
export function SettlementShape({ intersection, color = '#000000', isUpgradable = false, onUpgrade }: Props) {
  const [focus, setFocus] = useState(false)

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

  // Simple triangular arrow points like in the image
  const leftArrowPoints = [-6, -18, -12, -28, -18, -18]
  const centerArrowPoints = [-4, -20, 0, -30, 4, -20]
  const rightArrowPoints = [6, -18, 12, -28, 18, -18]

  return (
    <Group>
      <Line
        points={points}
        x={intersection.position.x}
        y={intersection.position.y}
        closed={true}
        shadowEnabled={true}
        shadowColor="#000000"
        shadowOffsetX={2}
        shadowBlur={5}
        shadowOpacity={0.6}
        strokeWidth={1.1}
        stroke={'#000000'}
        fill={color}
        onClick={isUpgradable ? handleUpgradeClick : undefined}
        onTouchEnd={isUpgradable ? handleUpgradeClick : undefined}
        onMouseEnter={isUpgradable ? handleMouseEnter : undefined}
        onMouseLeave={isUpgradable ? handleMouseLeave : undefined}
        scaleX={focus ? 1.1 : 1}
        scaleY={focus ? 1.1 : 1}
      />
      {isUpgradable && (
        <>
          {/* Left upgrade arrow */}
          <Line
            points={leftArrowPoints}
            x={intersection.position.x}
            y={intersection.position.y}
            closed={true}
            fill="#8BC34A"
            stroke="#689F38"
            strokeWidth={2}
            onClick={handleUpgradeClick}
            onTouchEnd={handleUpgradeClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            scaleX={focus ? 1.2 : 1}
            scaleY={focus ? 1.2 : 1}
            opacity={1}
            shadowEnabled={true}
            shadowColor="#000000"
            shadowOffsetX={1}
            shadowBlur={3}
            shadowOpacity={0.4}
          />
          {/* Center upgrade arrow */}
          <Line
            points={centerArrowPoints}
            x={intersection.position.x}
            y={intersection.position.y}
            closed={true}
            fill="#8BC34A"
            stroke="#689F38"
            strokeWidth={2}
            onClick={handleUpgradeClick}
            onTouchEnd={handleUpgradeClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            scaleX={focus ? 1.2 : 1}
            scaleY={focus ? 1.2 : 1}
            opacity={1}
            shadowEnabled={true}
            shadowColor="#000000"
            shadowOffsetX={1}
            shadowBlur={3}
            shadowOpacity={0.4}
          />
          {/* Right upgrade arrow */}
          <Line
            points={rightArrowPoints}
            x={intersection.position.x}
            y={intersection.position.y}
            closed={true}
            fill="#8BC34A"
            stroke="#689F38"
            strokeWidth={2}
            onClick={handleUpgradeClick}
            onTouchEnd={handleUpgradeClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            scaleX={focus ? 1.2 : 1}
            scaleY={focus ? 1.2 : 1}
            opacity={1}
            shadowEnabled={true}
            shadowColor="#000000"
            shadowOffsetX={1}
            shadowBlur={3}
            shadowOpacity={0.4}
          />
        </>
      )}
    </Group>
  )
}
