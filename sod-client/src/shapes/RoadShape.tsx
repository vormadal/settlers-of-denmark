import { Group, Line } from 'react-konva'
import { BorderEdge } from '../state/BorderEdge'
import { getCenter, getLineRotation } from '../utils/VectorMath'

interface Props {
  edge: BorderEdge
  color: string
}

// Medieval dirt road - rough, uneven, weathered by cart wheels and foot traffic
const dirtRoadPoints = [
  28, 7,    // right top, slightly uneven
  25, 5,    // wagon rut indent
  20, 8,    // bump from rocks
  15, 6,    
  5, 9,     // wider section where carts pass
  -2, 7,
  -8, 5,    // narrow worn section
  -15, 8,
  -20, 6,
  -25, 7,
  -28, 5,   // left top
  -26, -6,  // left bottom, eroded edge
  -22, -8,  // deeper rut
  -15, -5,
  -8, -7,
  -2, -4,   // center worn smooth
  5, -6,
  12, -4,
  18, -7,
  24, -5,
  27, -7    // right bottom
]

// Darker dirt patches for wheel ruts and heavy traffic areas
const rutPoints1 = [-18, 3, -12, 4, -8, 2, -12, -2, -18, -3]
const rutPoints2 = [8, 4, 15, 3, 18, 1, 15, -1, 8, -2]

export function RoadShape({ edge, color = '#000000' }: Props) {
  const center = getCenter(edge.pointA, edge.pointB)
  const rotation = getLineRotation(edge.pointA, edge.pointB)
  
  // Create a darker, muddy brown for the road
  const dirtColor = color === '#000000' ? '#8B4513' : color
  const darkDirt = color === '#000000' ? '#654321' : color
  
  return (
    <Group
      x={center.x}
      y={center.y}
      rotation={rotation}
    >
      {/* Main dirt road surface - rough and organic */}
      <Line
        points={dirtRoadPoints}
        closed={true}
        shadowEnabled={true}
        shadowColor="#2F1B0C"
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowBlur={3}
        shadowOpacity={0.5}
        strokeWidth={0.8}
        stroke={'#2F1B0C'}
        fill={dirtColor}
        tension={0.4}
      />
      
      {/* Left wagon rut - worn deeper by cart wheels */}
      <Line
        points={rutPoints1}
        closed={true}
        strokeWidth={0.5}
        stroke={'#2F1B0C'}
        fill={darkDirt}
        tension={0.6}
        opacity={0.7}
      />
      
      {/* Right wagon rut */}
      <Line
        points={rutPoints2}
        closed={true}
        strokeWidth={0.5}
        stroke={'#2F1B0C'}
        fill={darkDirt}
        tension={0.6}
        opacity={0.7}
      />
      
      {/* Scattered stones and debris along the road */}
      <Line
        points={[-22, 1, -20, 2, -21, 0]}
        closed={true}
        fill={'#666'}
        stroke={'#333'}
        strokeWidth={0.3}
      />
      
      <Line
        points={[10, -1, 12, 0, 11, -2]}
        closed={true}
        fill={'#777'}
        stroke={'#333'}
        strokeWidth={0.3}
      />
      
      <Line
        points={[2, 3, 4, 4, 3, 2]}
        closed={true}
        fill={'#555'}
        stroke={'#333'}
        strokeWidth={0.3}
      />
    </Group>
  )
}
