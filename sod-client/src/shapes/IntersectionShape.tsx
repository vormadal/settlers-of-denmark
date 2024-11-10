import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'
import { Circle } from 'react-konva'
import { useGameState } from '../context/GameStateContext'
import { Intersection } from '../state/Intersection'
import { useMyPlayer } from '../context/MeContext'

interface Type {
  intersection: Intersection
  onClick?: (intersection: Intersection) => void
}

const activeColor = '#ffffff'
export function IntersectionShape({ intersection, onClick }: Type) {
  const [state, room] = useGameState()
  const [me] = useMyPlayer()
  const [focus, setFocus] = useState(false)

  function handleClick() {
    room?.send('PLACE_SETTLEMENT', {
      intersectionId: intersection.id
    })
    onClick && onClick(intersection)
  }

  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true)
  }

  function handleMouseLeave() {
    setFocus(false)
  }

  if (!state?.availableIntersections.includes(intersection.id) || state.currentPlayer !== me?.id) return null

  return (
    <Circle
      x={intersection.position.x}
      y={intersection.position.y}
      radius={9}
      fill={activeColor}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scaleX={focus ? 1.6 : 1}
      scaleY={focus ? 1.6 : 1}
      opacity={0.6}
      shadowEnabled={true}
      shadowColor="#000000"
      shadowOffsetX={1}
      shadowBlur={2}
      shadowOpacity={0.3}
      strokeWidth={0.9}
      stroke={'#000000'}
    />
  )
}
