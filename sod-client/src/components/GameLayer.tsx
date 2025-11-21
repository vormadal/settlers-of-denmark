import { Layer } from 'react-konva'
import { EdgeShape } from '../shapes/EdgeShape'
import { SettlementShape } from '../shapes/SettlementShape'
import { IntersectionShape } from '../shapes/IntersectionShape'
import { Land } from '../shapes/LandShape'
import { RoadShape } from '../shapes/RoadShape'
import { RobberShape } from '../shapes/RobberShape'
import { RobberPlacementIndicator } from '../shapes/RobberPlacementIndicator'
import { CityShape } from '../shapes/CityShape'
import { HarborShape } from '../shapes/HarborShape'
import { Hex } from '../state/Hex'
import { BorderEdge } from '../state/BorderEdge'
import { Intersection } from '../state/Intersection'
import { Harbor } from '../state/Harbor'
import { Player } from '../state/Player'
import NumberToken from '../shapes/NumberToken'
import { colors as CardColors } from '../utils/colors'

interface GameLayerProps {
  hexes: Hex[]
  edges: BorderEdge[]
  intersections: Intersection[]
  harbors: Harbor[]
  players: Player[]
  robberHex: string | undefined
  availableHexes: string[]
  availableEdges: string[]
  availableIntersections: string[]
  upgradableSettlements: string[]
  isCurrentPlayerTurn: boolean
  isRobberMoveable: boolean
  colors: string[]
  onMoveRobber: (hexId: string) => void
  onPlaceRoad: (edgeId: string) => void
  onPlaceSettlement: (intersectionId: string) => void
  onUpgradeSettlement: (intersectionId: string) => void
  currentPlayerId?: string
}

export function GameLayer({
  hexes,
  edges,
  intersections,
  harbors,
  players,
  robberHex,
  availableHexes,
  availableEdges,
  availableIntersections,
  upgradableSettlements,
  isCurrentPlayerTurn,
  isRobberMoveable,
  colors,
  onMoveRobber,
  onPlaceRoad,
  onPlaceSettlement,
  onUpgradeSettlement,
  currentPlayerId
}: GameLayerProps) {

  // Create a map for O(1) intersection lookups
  const intersectionMap = new Map(intersections.map((int) => [int.id, int]))

  const settlements = players
    .map((player, i) =>
      player.settlements
        .filter((x) => !!x.intersection && intersectionMap.has(x.intersection))
        .map((settlement) => {
          const intersection = intersectionMap.get(settlement.intersection)!
          return { player, settlement, color: colors[i], intersection }
        })
    )
    .flat()

  const cities = players
    .map((player, i) =>
      player.cities
        .filter((x) => !!x.intersection && intersectionMap.has(x.intersection))
        .map((settlement) => {
          const intersection = intersectionMap.get(settlement.intersection)!
          return { player, settlement, color: colors[i], intersection }
        })
    )
    .flat()

  const roads = players
    .map((player, i) => player.roads
      .filter((x) => !!x.edge)
      .map((road) => {
        const { pointA, pointB } = edges.find((e) => e.id === road.edge)!
        return { player, road, color: colors[i], pointA, pointB }
      }))
    .flat()

  return (
    <Layer>
      {hexes.map(({ id, value, type, intersections }) => (
        <Land
          key={id}
          color={CardColors[type]}
          points={intersections.map(x => x.position)}
        >
          {value !== undefined && (
            <NumberToken
              value={value}
            />
          )}
        </Land>
      ))}

      {/* Robber placement indicators - only show when moving robber */}
      {isRobberMoveable &&
        availableHexes.map((hexId) => {
          const hex = hexes.find((h) => h.id === hexId)
          return hex ? (
            <RobberPlacementIndicator
              key={`robber-indicator-${hexId}`}
              hex={hex}
              onClick={onMoveRobber}
            />
          ) : null
        })}

      {edges.map(({ id, pointA, pointB }) => (
        <EdgeShape
          show={availableEdges.includes(id)}
          key={id}
          pointA={pointA}
          pointB={pointB}
          onClick={() => onPlaceRoad(id)}
        />
      ))}

      {harbors.map((h) => (
        <HarborShape
          key={h.id}
          pointA={h.edge.pointA}
          pointB={h.edge.pointB}
          cardTypes={h.cardTypes.toArray()}
          ratio={h.ratio}
          hexCenter={h.hexPosition}
        />
      ))}

      {intersections.map((x) => (
        <IntersectionShape
          key={x.id}
          position={x.position}
          show={availableIntersections.includes(x.id) && isCurrentPlayerTurn}
          onClick={() => onPlaceSettlement(x.id)}
        />
      ))}

      {roads.map(({ road, color, pointA, pointB }) => (
        <RoadShape
          key={road.id}
          color={color}
          pointA={pointA}
          pointB={pointB}
        />
      ))}

      {settlements.map(({ settlement, player: settlementPlayer, color, intersection }) => {
        const isUpgradable =
          upgradableSettlements.includes(settlement.intersection) &&
          isCurrentPlayerTurn &&
          settlementPlayer.id === currentPlayerId

        return (
          <SettlementShape
            key={settlement.id}
            color={color}
            position={intersection.position}
            onClick={() => onUpgradeSettlement(intersection.id)}
            showUpgradeAnimation={isUpgradable}
          />
        )
      })}

      {cities.map(({ settlement, player, color, intersection }) => (
        <CityShape
          key={settlement.id}
          color={color}
          position={intersection.position}
        />
      ))}

      {/* Render the robber */}
      {robberHex && (
        <RobberShape
          hex={hexes.find((h) => h.id === robberHex)!}
          isMoveable={isRobberMoveable}
        />
      )}
    </Layer>
  )
}