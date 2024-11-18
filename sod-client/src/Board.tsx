import { Layer, Stage } from 'react-konva'
import { useGameState } from './context/GameStateContext'
import { EdgeShape } from './shapes/EdgeShape'
import { SettlementShape } from './shapes/SettlementShape'
import { IntersectionShape } from './shapes/IntersectionShape'
import { Land } from './shapes/LandShape'
import { RoadShape } from './shapes/RoadShape'
import { getUniqueColor } from './utils/colors'

interface Props {
  width: number
}


const colors = new Array(8).fill(0).map((_, i) => getUniqueColor(i))
export function Board({ width: windowWidth }: Props) {
  const [state] = useGameState()
  const players = [...(state?.players?.values() || [])]

  const xs = state?.hexes.map((x) => x.position.x).sort((a, b) => a - b) || [0]
  const ys = state?.hexes.map((x) => x.position.y).sort((a, b) => a - b) || [0]

  const buffer = 100
  const xMin = xs.slice(0, 1)[0] - buffer
  const xMax = xs.slice(-1)[0] + buffer
  const yMin = ys.slice(0, 1)[0] - buffer
  const yMax = ys.slice(-1)[0] + buffer

  const [cx, cy] = [(xMin + xMax) / 2, (yMin + yMax) / 2]

  const width = xMax - xMin
  const height = yMax - yMin

  const windowHeight = window.innerHeight

  // const scaleWidth = width / windowWidth;
  const scaleWidth = windowWidth / width
  // const scaleHeight = height / windowHeight;
  const scaleHeight = windowHeight / height
  let scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight
  if (scale < 0.5) scale = 1

  const offsetX = -windowWidth / 2 + cx * scale
  const offsetY = -window.innerHeight / 2 + cy * scale

  const settlements = players
    .map((player, i) =>
      player.settlements.filter((x) => !!x.intersection).map((settlement) => ({ player, settlement, color: colors[i] }))
    )
    .flat()

  const roads = players
    .map((player, i) => player.roads.filter((x) => !!x.edge).map((road) => ({ player, road, color: colors[i] })))
    .flat()

  if (!state) return null
  return (
    <Stage
      width={windowWidth}
      height={window.innerHeight}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <Layer scale={{ x: scale, y: scale }}>
        {state?.hexes.map((x) => (
          <Land
            key={x.id}
            tile={x}
          />
        ))}

        {state?.edges.map((x) => (
          <EdgeShape
            key={x.id}
            edge={x}
          />
        ))}

        {state?.intersections.map((x) => (
          <IntersectionShape
            key={x.id}
            intersection={x}
          />
        ))}

        {settlements.map(({ settlement, player, color }) => (
          <SettlementShape
            key={settlement.id}
            color={color}
            intersection={state.intersections.find((x) => x.id === settlement.intersection)!}
          />
        ))}

        {settlements.map(({ settlement, player, color }) => (
          <SettlementShape
            key={settlement.id}
            color={color}
            intersection={state.intersections.find((x) => x.id === settlement.intersection)!}
          />
        ))}

        {roads.map(({ road, player, color }) => (
          <RoadShape
            key={road.id}
            color={color}
            edge={state.edges.find((x) => x.id === road.edge)!}
          />
        ))}
      </Layer>
    </Stage>
  )
}
