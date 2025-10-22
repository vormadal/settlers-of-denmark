import { getUniqueColor } from './utils/colors'
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
  useAvailableSettlementIntersections
} from './hooks/stateHooks'
import { useRoom } from './context/RoomContext'
import { usePlayer } from './context/PlayerContext'
import { GameStage } from './components/GameStage'
import { GameLayer } from './components/GameLayer'

interface Props {
  width: number
  height: number
}

const colors = new Array(8).fill(0).map((_, i) => getUniqueColor(i))

export function Board({ width: windowWidth, height: windowHeight }: Props) {
  const players = usePlayers()
  const currentPlayer = useCurrentPlayer() // The player whose turn it is
  const player = usePlayer() // The current user's player
  const hexes = useHexes()
  const edges = useEdges()
  const intersections = useIntersections()
  const harbors = useHarbors()
  const robberHex = useRobberHex()
  const availableHexes = useAvailableHexes()
  const phase = usePhase()
  const room = useRoom()
  const upgradableSettlements = useUpgradableSettlements()
  const availableEdges = useAvailableEdges()
  const availableIntersections = useAvailableSettlementIntersections()

  if (hexes.length === 0) return null

  // Calculate board bounds
  const x_all = edges.map((x) => x.pointA.x).sort((a, b) => a - b) || [0]
  const y_all = edges.map((x) => x.pointA.y).sort((a, b) => a - b) || [0]

  const buffer = 20
  const boardBounds = {
    xMin: x_all.slice(0, 1)[0] - buffer,
    xMax: x_all.slice(-1)[0] + buffer,
    yMin: y_all.slice(0, 1)[0] - buffer,
    yMax: y_all.slice(-1)[0] + buffer,
  }

  // Handle robber movement
  const handleMoveRobber = (hexId: string) => {
    if (phase.key === 'moveRobber' && availableHexes.includes(hexId) && isCurrentPlayerTurn) {
      room?.send('MOVE_ROBBER', { hexId })
    }
  }

  // Handle settlement upgrade to city
  const handleUpgradeSettlement = (intersectionId: string) => {
    room?.send('PLACE_CITY', {
      intersectionId: intersectionId
    })
  }

  function placeRoad(edgeId: string) {
    room?.send("PLACE_ROAD", {
      edgeId: edgeId,
    });
  }

  function placeSettlement(intersectionId: string) {
    room?.send('PLACE_SETTLEMENT', {
      intersectionId: intersectionId
    })
  }

  // Check if we're in robber movement phase AND it's the current user's turn
  const isCurrentPlayerTurn = Boolean(player && currentPlayer && player.id === currentPlayer.id)
  const isRobberMoveable = phase.key === 'moveRobber' && isCurrentPlayerTurn

  return (
    <GameStage 
      width={windowWidth} 
      height={windowHeight} 
      boardBounds={boardBounds}
    >
      <GameLayer
        hexes={hexes}
        edges={edges}
        intersections={intersections}
        harbors={harbors}
        players={players}
        robberHex={robberHex || undefined}
        availableHexes={availableHexes}
        availableEdges={availableEdges}
        availableIntersections={availableIntersections}
        upgradableSettlements={upgradableSettlements}
        isCurrentPlayerTurn={isCurrentPlayerTurn}
        isRobberMoveable={isRobberMoveable}
        colors={colors}
        onMoveRobber={handleMoveRobber}
        onPlaceRoad={placeRoad}
        onPlaceSettlement={placeSettlement}
        onUpgradeSettlement={handleUpgradeSettlement}
        currentPlayerId={player?.id}
      />
    </GameStage>
  )
}