import { Layer, Stage } from 'react-konva'
import { EdgeShape } from './shapes/EdgeShape'
import { SettlementShape } from './shapes/SettlementShape'
import { IntersectionShape } from './shapes/IntersectionShape'
import { Land } from './shapes/LandShape'
import { RoadShape } from './shapes/RoadShape'
import { getUniqueColor } from './utils/colors'
import { useEdges, useHexes, useIntersections, usePlayers } from './hooks/stateHooks'

interface Props {
  width: number
  height: number
}

const colors = new Array(8).fill(0).map((_, i) => getUniqueColor(i))
export function Board({ width: windowWidth, height: windowHeight }: Props) {
  const players = usePlayers()
  const hexes = useHexes()
  const edges = useEdges()
  const intersections = useIntersections()

  if (hexes.length === 0) return null

  const x_all = edges.map((x) => x.pointA.x).sort((a, b) => a - b) || [0]
  const y_all = edges.map((x) => x.pointA.y).sort((a, b) => a - b) || [0]

  const buffer = 20
  const xMin = x_all.slice(0, 1)[0] - buffer
  const xMax = x_all.slice(-1)[0] + buffer
  const yMin = y_all.slice(0, 1)[0] - buffer
  const yMax = y_all.slice(-1)[0] + buffer

  const [cx, cy] = [(xMin + xMax) / 2, (yMin + yMax) / 2]

  const width = xMax - xMin
  const height = yMax - yMin

  const scaleWidth = windowWidth / width
  const scaleHeight = windowHeight / height
  let scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight
  
  const offsetX = -windowWidth / 2 + cx * scale
  const offsetY = -windowHeight / 2 + cy * scale

  const settlements = players
    .map((player, i) =>
      player.settlements.filter((x) => !!x.intersection).map((settlement) => ({ player, settlement, color: colors[i] }))
    )
    .flat()

  const roads = players
    .map((player, i) => player.roads.filter((x) => !!x.edge).map((road) => ({ player, road, color: colors[i] })))
    .flat()

  return (
    <Stage
      width={windowWidth}
      height={windowHeight}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <Layer scale={{ x: scale, y: scale }}>
        {hexes.map((x) => (
          <Land
            key={x.id}
            tile={x}
          />
        ))}

        {edges.map((x) => (
          <EdgeShape
            key={x.id}
            edge={x}
          />
        ))}

        {intersections.map((x) => (
          <IntersectionShape
            key={x.id}
            intersection={x}
          />
        ))}

        {settlements.map(({ settlement, player, color }) => (
          <SettlementShape
            key={settlement.id}
            color={color}
            intersection={intersections.find((x) => x.id === settlement.intersection)!}
          />
        ))}

        {settlements.map(({ settlement, player, color }) => (
          <SettlementShape
            key={settlement.id}
            color={color}
            intersection={intersections.find((x) => x.id === settlement.intersection)!}
          />
        ))}

        {roads.map(({ road, player, color }) => (
          <RoadShape
            key={road.id}
            color={color}
            edge={edges.find((x) => x.id === road.edge)!}
          />
        ))}
      </Layer>
    </Stage>
  )
}
