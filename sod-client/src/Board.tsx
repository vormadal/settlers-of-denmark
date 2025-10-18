import { Layer, Stage } from "react-konva";
import { EdgeShape } from "./shapes/EdgeShape";
import { SettlementShape } from "./shapes/SettlementShape";
import { IntersectionShape } from "./shapes/IntersectionShape";
import { Land } from "./shapes/LandShape";
import { RoadShape } from "./shapes/RoadShape";
import { RobberShape } from "./shapes/RobberShape";
import { RobberPlacementIndicator } from "./shapes/RobberPlacementIndicator";
import { getUniqueColor } from "./utils/colors";
import {
  useEdges,
  useHarbors,
  useHexes,
  useIntersections,
  usePlayers,
  useRobberHex,
  useAvailableHexes,
  usePhase,
  useCurrentPlayer,
  useUpgradableSettlements,
  useAvailableEdges,
} from "./hooks/stateHooks";
import { CityShape } from "./shapes/CityShape";
import { HarborShape } from "./shapes/HarborShape";
import { useRoom } from "./context/RoomContext";
import { usePlayer } from "./context/PlayerContext";

interface Props {
  width: number;
  height: number;
}

const colors = new Array(8).fill(0).map((_, i) => getUniqueColor(i));
export function Board({ width: windowWidth, height: windowHeight }: Props) {
  const players = usePlayers();
  const currentPlayer = useCurrentPlayer(); // The player whose turn it is
  const player = usePlayer(); // The current user's player
  const hexes = useHexes();
  const edges = useEdges();
  const intersections = useIntersections();
  const harbors = useHarbors();
  const robberHex = useRobberHex();
  const availableHexes = useAvailableHexes();
  const phase = usePhase();
  const room = useRoom();
  const upgradableSettlements = useUpgradableSettlements();
  const availableEdges = useAvailableEdges();

  if (hexes.length === 0) return null;

  const x_all = edges.map((x) => x.pointA.x).sort((a, b) => a - b) || [0];
  const y_all = edges.map((x) => x.pointA.y).sort((a, b) => a - b) || [0];

  const buffer = 20;
  const xMin = x_all.slice(0, 1)[0] - buffer;
  const xMax = x_all.slice(-1)[0] + buffer;
  const yMin = y_all.slice(0, 1)[0] - buffer;
  const yMax = y_all.slice(-1)[0] + buffer;

  const [cx, cy] = [(xMin + xMax) / 2, (yMin + yMax) / 2];

  const width = xMax - xMin;
  const height = yMax - yMin;

  const scaleWidth = windowWidth / width;
  const scaleHeight = windowHeight / height;
  let scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;

  const offsetX = -windowWidth / 2 + cx * scale;
  const offsetY = -windowHeight / 2 + cy * scale;

  const settlements = players
    .map((player, i) =>
      player.settlements
        .filter((x) => !!x.intersection)
        .map((settlement) => ({ player, settlement, color: colors[i] }))
    )
    .flat();
  const cities = players
    .map((player, i) =>
      player.cities
        .filter((x) => !!x.intersection)
        .map((settlement) => ({ player, settlement, color: colors[i] }))
    )
    .flat();
  const roads = players
    .map((player, i) =>
      player.roads
        .filter((x) => !!x.edge)
        .map((road) => ({ player, road, color: colors[i] }))
    )
    .flat();

  // Handle robber movement
  const handleMoveRobber = (hexId: string) => {
    if (
      phase.key === "moveRobber" &&
      availableHexes.includes(hexId) &&
      isCurrentPlayerTurn
    ) {
      room?.send("MOVE_ROBBER", { hexId });
    }
  };

  // Handle settlement upgrade to city
  const handleUpgradeSettlement = (intersectionId: string) => {
    room?.send("PLACE_CITY", {
      intersectionId: intersectionId,
    });
  };

  // Check if we're in robber movement phase AND it's the current user's turn
  const isCurrentPlayerTurn = Boolean(
    player && currentPlayer && player.id === currentPlayer.id
  );
  const isRobberMoveable = phase.key === "moveRobber" && isCurrentPlayerTurn;

  return (
    <Stage
      width={windowWidth}
      height={windowHeight}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <Layer scale={{ x: scale, y: scale }}>
        {hexes.map((x) => (
          <Land key={x.id} tile={x} />
        ))}

        {/* Robber placement indicators - only show when moving robber */}
        {isRobberMoveable &&
          availableHexes.map((hexId) => {
            const hex = hexes.find((h) => h.id === hexId);
            return hex ? (
              <RobberPlacementIndicator
                key={`robber-indicator-${hexId}`}
                hex={hex}
                onClick={handleMoveRobber}
              />
            ) : null;
          })}

        {edges.map((x) => (
          <EdgeShape show={availableEdges.includes(x.id)} key={x.id} edge={x} />
        ))}

        {harbors.map((h) => (
          <HarborShape key={h.id} harbor={h} />
        ))}

        {intersections.map((x) => (
          <IntersectionShape key={x.id} intersection={x} />
        ))}

        {settlements.map(({ settlement, player: settlementPlayer, color }) => {
          const intersection = intersections.find(
            (x) => x.id === settlement.intersection
          )!;
          const isUpgradable =
            upgradableSettlements.includes(settlement.intersection) &&
            isCurrentPlayerTurn &&
            settlementPlayer.id === player?.id;

          return (
            <SettlementShape
              key={settlement.id}
              color={color}
              intersection={intersection}
              isUpgradable={isUpgradable}
              onUpgrade={handleUpgradeSettlement}
            />
          );
        })}

        {cities.map(({ settlement, player, color }) => (
          <CityShape
            key={settlement.id}
            color={color}
            intersection={
              intersections.find((x) => x.id === settlement.intersection)!
            }
          />
        ))}

        {roads.map(({ road, player, color }) => (
          <RoadShape
            key={road.id}
            color={color}
            edge={edges.find((x) => x.id === road.edge)!}
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
    </Stage>
  );
}
