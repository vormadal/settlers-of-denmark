import { KonvaEventObject } from 'konva/lib/Node'
import { useState } from 'react'
import { Ellipse } from 'react-konva'
import { useGameState } from '../GameStateContext'
import { BorderEdge } from '../state/BorderEdge'
import { Point } from '../state/Point'
import { getLineRotation } from '../utils/VectorMath'

interface Props {
  edge: BorderEdge
}

function getCenter(pointA: Point, pointB: Point) {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2
  }
}

export function EdgeShape({ edge }: Props) {
  const [state, room] = useGameState()
  const [focus, setFocus] = useState(false)

  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true)
  }

  function handleMouseLeave() {
    setFocus(false)
  }

  function handleClick() {
    room?.send('PLACE_ROAD', {
      edgeId: edge.id
    })
  }

  const center = getCenter(edge.pointA, edge.pointB)
  const rotation = getLineRotation(edge.pointA, edge.pointB)

  if (!state?.availableEdges.includes(edge.id)) return null
  
  return (
    <Ellipse
      x={center.x}
      y={center.y}
      onClick={handleClick}
      radiusX={11}
      radiusY={6}
      rotation={rotation}
      fill={'#ffffff'}
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
