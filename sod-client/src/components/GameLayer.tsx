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
  
  const settlements = players
    .map((player, i) =>
      player.settlements
        .filter((x) => !!x.intersection)
        .map((settlement) => ({ player, settlement, color: colors[i] }))
    )
    .flat()
    
  const cities = players
    .map((player, i) =>
      player.cities
        .filter((x) => !!x.intersection)
        .map((settlement) => ({ player, settlement, color: colors[i] }))
    )
    .flat()
    
  const roads = players
    .map((player, i) => player.roads
      .filter((x) => !!x.edge)
      .map((road) => ({ player, road, color: colors[i] })))
    .flat()

  return (
    <Layer>
      {hexes.map((x) => (
        <Land
          key={x.id}
          hex={x}
        />
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

      {edges.map((x) => (
        <EdgeShape
          show={availableEdges.includes(x.id)}
          key={x.id}
          edge={x}
          onClick={() => onPlaceRoad(x.id)}
        />
      ))}

      {harbors.map((h) => (
        <HarborShape
          key={h.id}
          harbor={h}
          hexCenter={h.hexPosition}
        />
      ))}

      {intersections.map((x) => (
        <IntersectionShape
          key={x.id}
          intersection={x}
          show={availableIntersections.includes(x.id) && isCurrentPlayerTurn}
          onClick={() => onPlaceSettlement(x.id)}
        />
      ))}

      {roads.map(({ road, player, color }) => (
        <RoadShape
          key={road.id}
          color={color}
          edge={edges.find((x) => x.id === road.edge)!}
        />
      ))}
      
      {settlements.map(({ settlement, player: settlementPlayer, color }) => {
        const intersection = intersections.find((x) => x.id === settlement.intersection)!
        const isUpgradable =
          upgradableSettlements.includes(settlement.intersection) &&
          isCurrentPlayerTurn &&
          settlementPlayer.id === currentPlayerId

        return (
          <SettlementShape
            key={settlement.id}
            color={color}
            intersection={intersection}
            isUpgradable={isUpgradable}
            onUpgrade={onUpgradeSettlement}
          />
        )
      })}

      {cities.map(({ settlement, player, color }) => (
        <CityShape
          key={settlement.id}
          color={color}
          intersection={intersections.find((x) => x.id === settlement.intersection)!}
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