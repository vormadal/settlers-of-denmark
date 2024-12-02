import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'
import { Circle } from 'react-konva'
import { usePlayer } from '../context/PlayerContext'
import { useRoom } from '../context/RoomContext'
import { useAvailableIntersections, useCurrentPlayer } from '../hooks/stateHooks'
import { Intersection } from '../state/Intersection'

interface Type {
  intersection: Intersection
  onClick?: (intersection: Intersection) => void
}

const activeColor = '#ffffff'
export function IntersectionShape({ intersection, onClick }: Type) {
  const room = useRoom()
  const [focus, setFocus] = useState(false)
  const availableIntersections = useAvailableIntersections()
  const player = usePlayer()
  const currentPlayer = useCurrentPlayer()
  
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

  if (!availableIntersections.includes(intersection.id) || currentPlayer !== player?.id) return null

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
