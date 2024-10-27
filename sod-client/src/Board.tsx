import { Layer, Stage } from 'react-konva'
import { useGameState } from './GameStateContext'
import { EdgeShape } from './shapes/EdgeShape'
import { HouseShape } from './shapes/HouseShape'
import { IntersectionShape } from './shapes/IntersectionShape'
import { Land } from './shapes/LandShape'
import { RoadShape } from './shapes/RoadShape'

interface Props {
  width: number
}

const colors = ['#ff0000', '#00ff00', '#0000ff', '#f0000f']
export function Board({ width: windowWidth }: Props) {
  const [state] = useGameState()
  const players = [...(state?.players?.values() || [])]

  const xs = state?.landTiles.map((x) => x.position.x).sort((a, b) => a - b) || [0]
  const ys = state?.landTiles.map((x) => x.position.y).sort((a, b) => a - b) || [0]

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

  const houses = players
    .map((player, i) =>
      player.houses.filter((x) => !!x.intersection).map((house) => ({ player, house, color: colors[i] }))
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
        {state?.landTiles.map((x) => (
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

        {houses.map(({ house, player, color }) => (
          <HouseShape
            key={house.id}
            color={color}
            intersection={state.intersections.find((x) => x.id === house.intersection)!}
          />
        ))}

        {houses.map(({ house, player, color }) => (
          <HouseShape
            key={house.id}
            color={color}
            intersection={state.intersections.find((x) => x.id === house.intersection)!}
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
