import { Group, Text, Rect, Line } from 'react-konva'
import { Harbor } from '../state/Harbor'
import { getCenter } from '../utils/VectorMath'

interface Props {
  harbor: Harbor
}

/*
  HarborShape renders a harbor positioned at the midpoint of its associated edge but slightly offset outward.
  It displays the trade ratio (e.g., 3:1) and either the specific resource or 'Any'.
*/
export function HarborShape({ harbor }: Props) {
  const edge = harbor.edge
  if (!edge?.pointA || !edge?.pointB) return null

  const center = getCenter(edge.pointA, edge.pointB)
  const ratioText = `${harbor.ratio}:1`
  const cardTypes = harbor.cardTypes?.length > 1 ? 'Any' : harbor.cardTypes[0]

  // Geometry
  const dx = edge.pointB.x - edge.pointA.x
  const dy = edge.pointB.y - edge.pointA.y
  const edgeLen = Math.sqrt(dx * dx + dy * dy) || 1
  const ex = dx / edgeLen
  const ey = dy / edgeLen
  // outward normal
  const nx = -ey
  const ny = ex

  const boatDistance = 24 // distance from center along outward normal
  const boatX = center.x + nx * boatDistance
  const boatY = center.y + ny * boatDistance

  // Boat orientation angle (pointing outward). Boat designed pointing up (-Y) by default.
  const boatAngleDeg = (Math.atan2(ny, nx) * 180) / Math.PI - 90

  // Piers: small wooden walkways from each intersection towards boat
  const pierReachFactor = 0.55 // portion of distance from endpoint to boat used for pier length
  const endpoints = [edge.pointA, edge.pointB]
  const pierWidth = 6

  return (
    <Group listening={false}>
      {/* Piers */}
      {endpoints.map((p, i) => {
        const vx = boatX - p.x
        const vy = boatY - p.y
        const dist = Math.sqrt(vx * vx + vy * vy) || 1
        const ux = vx / dist
        const uy = vy / dist
        const length = dist * pierReachFactor
        const midX = p.x + ux * (length / 2)
        const midY = p.y + uy * (length / 2)
        const angleDeg = (Math.atan2(uy, ux) * 180) / Math.PI
        const boardCount = Math.max(3, Math.floor(length / 10))
        return (
          <Group key={i} x={midX} y={midY} rotation={angleDeg}>
            <Rect
              x={-length / 2}
              y={-pierWidth / 2}
              width={length}
              height={pierWidth}
              fill={'#a98274'}
              shadowColor={'#000'}
              shadowBlur={2}
              shadowOpacity={0.25}
              cornerRadius={2}
              stroke={'#6d4c41'}
              strokeWidth={0.6}
            />
            {/* Planks detail */}
            {Array.from({ length: boardCount }).map((_, j) => {
              const xPos = -length / 2 + (j * length) / boardCount
              return (
                <Line
                  key={j}
                  points={[xPos, -pierWidth / 2, xPos, pierWidth / 2]}
                  stroke={'#5d4037'}
                  strokeWidth={0.7}
                />
              )
            })}
            {/* Posts at ends */}
            <Rect x={-length / 2 - 1.5} y={-pierWidth / 2} width={3} height={pierWidth} fill={'#5d4037'} cornerRadius={1} />
            <Rect x={length / 2 - 1.5} y={-pierWidth / 2} width={3} height={pierWidth} fill={'#5d4037'} cornerRadius={1} />
          </Group>
        )
      })}

      {/* Boat Group */}
      <Group x={boatX} y={boatY} rotation={boatAngleDeg}>
        {/* Hull as polygon (side view) */}
        <Line
          points={[-14, 6, -10, -2, 0, -6, 10, -2, 14, 6]}
          closed
          fill={'#5d4037'}
          stroke={'#3e2723'}
          strokeWidth={1}
          shadowColor={'#000'}
          shadowOpacity={0.3}
          shadowBlur={3}
        />
        {/* Deck rim */}
        <Line
          points={[-11.5, 1.5, -7, -1.5, 0, -3.5, 7, -1.5, 11.5, 1.5]}
          stroke={'#d7ccc8'}
          strokeWidth={1}
        />
        {/* Mast */}
        <Rect x={-1.2} y={-18} width={2.4} height={18} fill={'#3e2723'} />
        {/* Main sail */}
        <Line
          points={[0, -18, 12, -8, 0, -8]}
          closed
          fill={'#eeeeee'}
          stroke={'#bdbdbd'}
          strokeWidth={0.8}
        />
        {/* Jib sail */}
        <Line
          points={[0, -14, -8, -6, 0, -6]}
          closed
          fill={'#fafafa'}
          stroke={'#cfcfcf'}
          strokeWidth={0.6}
        />
        {/* Flag */}
        <Line
          points={[0, -18, 5, -16, 0, -14]}
          closed
          fill={'#ff5252'}
          stroke={'#c62828'}
          strokeWidth={0.6}
        />
      </Group>

      {/* Readable label (ratio + resource) */}
      {cardTypes && (
        <Group x={boatX} y={boatY - 40} listening={false}>
          {(() => {
            const ratioFontSize = 12
            const resourceFontSize = 11
            const paddingX = 6
            const paddingY = 4
            const lineGap = 2
            const lines = [ratioText, cardTypes]
            const estWidth = Math.max(
              ratioText.length * ratioFontSize * 0.55,
              (cardTypes?.length || 0) * resourceFontSize * 0.55
            )
            const width = Math.max(34, estWidth + paddingX * 2)
            const height = ratioFontSize + resourceFontSize + lineGap + paddingY * 2
            return (
              <Group offsetX={width / 2}>
                <Rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill={'rgba(255,255,255,0.9)'}
                  stroke={'#333'}
                  strokeWidth={0.75}
                  cornerRadius={4}
                  shadowColor={'#000'}
                  shadowBlur={4}
                  shadowOpacity={0.35}
                />
                <Text
                  x={0}
                  y={paddingY - 1}
                  width={width}
                  text={lines[0]}
                  fontSize={ratioFontSize}
                  fontStyle={'bold'}
                  fill={'#212121'}
                  align={'center'}
                  shadowColor={'#fff'}
                  shadowBlur={1}
                />
                <Text
                  x={0}
                  y={paddingY + ratioFontSize + lineGap - 1}
                  width={width}
                  text={lines[1]}
                  fontSize={resourceFontSize}
                  fill={'#263238'}
                  align={'center'}
                />
              </Group>
            )
          })()}
        </Group>
      )}
    </Group>
  )
}
