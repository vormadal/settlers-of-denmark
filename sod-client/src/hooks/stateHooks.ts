import { useEffect, useState } from 'react'
import { useRoom } from '../context/RoomContext'
import { Player } from '../state/Player'
import { Die } from '../state/Die'
import { Card } from '../state/Card'
import { Hex } from '../state/Hex'
import { BorderEdge } from '../state/BorderEdge'
import { Intersection } from '../state/Intersection'
import { Harbor } from '../state/Harbor'

export function useAvailableSettlementIntersections() {
  const gameRoom = useRoom()
  const [availableSettlementIntersections, setAvailableSettlementIntersections] = useState<string[]>(
    gameRoom?.state.availableSettlementIntersections.toArray() || []
  )
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('availableSettlementIntersections', (intersections) => {
      setAvailableSettlementIntersections(intersections.toArray())
    })
  }, [gameRoom])
  return availableSettlementIntersections
}

export function useUpgradableSettlements() {
  const gameRoom = useRoom()
  const [upgradableSettlements, setUpgradableSettlements] = useState<string[]>(
    gameRoom?.state.availableCityIntersections.toArray() || []
  )
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('availableCityIntersections', (intersections) => {
      setUpgradableSettlements(intersections.toArray())
    })
  }, [gameRoom])
  return upgradableSettlements
}

export function useAvailableEdges() {
  const gameRoom = useRoom()
  const [availableRoads, setAvailableRoads] = useState<string[]>(gameRoom.state.availableEdges.toArray())
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('availableEdges', (value) => {
      setAvailableRoads(value.toArray())
    })
  }, [gameRoom])
  return availableRoads
}

export function useCurrentPlayer() {
  const gameRoom = useRoom()
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(
    gameRoom.state.players.get(gameRoom.state.currentPlayer) || null
  )
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('currentPlayer', (value) => {
      setCurrentPlayer(gameRoom.state.players.get(value) || null)
    })
  }, [gameRoom])
  return currentPlayer
}

export function usePlayers() {
  const gameRoom = useRoom()
  const [players, setPlayers] = useState<Player[]>([...(gameRoom?.state.players.values() || [])])
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.onChange(() => {
      setPlayers([...gameRoom.state.players.values()])
    })
  }, [gameRoom])
  return players
}

export function usePhase() {
  const gameRoom = useRoom()
  const [phase, setPhase] = useState<{ key: string; label: string }>({ key: '', label: '' })
  useEffect(() => {
    if (!gameRoom) return
    gameRoom.state.listen('phase', (value) => {
      const state = gameRoom.state
      let label =
        {
          placingSettlement: `${state.currentPlayer} is placing settlement`,
          placingRoad: `${state.currentPlayer} is placing road`,
          rollingDice: `${state.currentPlayer} is Rolling Dice`,
          turn: `${state.currentPlayer}'s Turn`
        }[value] || value

      setPhase({ key: value, label })
    })
  }, [gameRoom])
  return phase
}

export function useDice() {
  const gameRoom = useRoom()
  const [dice, setDice] = useState<Die[]>([...gameRoom.state.dice.values()])
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.onChange(() => {
      setDice([...gameRoom.state.dice.values()])
    })
  }, [gameRoom])
  return dice
}

export function useDeck() {
  const gameRoom = useRoom()
  const [deck, setDeck] = useState<Card[]>([...gameRoom.state.deck.values()])
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.onChange(() => {
      setDeck([...gameRoom.state.deck.values()])
    })
  }, [gameRoom])
  return deck
}

export function useHexes() {
  const gameRoom = useRoom()
  const [hexes, setHexes] = useState<Hex[]>([...gameRoom.state.hexes.values()])
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('hexes', (value) => {
      setHexes([...value.values()])
    })
  }, [gameRoom])
  return hexes
}

export function useEdges() {
  const gameRoom = useRoom()
  const [edges, setEdges] = useState<BorderEdge[]>([...gameRoom.state.edges.values()])
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('edges', (value) => {
      setEdges([...value.values()])
    })
  }, [gameRoom])
  return edges
}

export function useIntersections() {
  const gameRoom = useRoom()
  const [intersections, setIntersections] = useState<Intersection[]>([...gameRoom.state.intersections.values()])
  useEffect(() => {
    if (!gameRoom) return

    gameRoom.state.listen('intersections', (value) => {
      setIntersections([...value.values()])
    })
  }, [gameRoom])
  return intersections
}

export function useHarbors() {
  const gameRoom = useRoom()
  const [harbors, setHarbors] = useState<Harbor[]>([...gameRoom.state.harbors.values()])
  useEffect(() => {
    if (!gameRoom) return
    gameRoom.state.listen('harbors', (value) => {
      setHarbors([...value.values()])
    })
  }, [gameRoom])
  return harbors
}

export function useIsGameEnded() {
  const gameRoom = useRoom()
  const [ended, setEnded] = useState<boolean>(gameRoom?.state.isGameEnded || false)
  useEffect(() => {
    if (!gameRoom) return
    gameRoom.state.listen('isGameEnded', (value) => setEnded(value))
  }, [gameRoom])
  console.log('Game ended state:', ended)
  return ended
}

export function useVictoryPointsToWin() {
  const gameRoom = useRoom()
  const [vp, setVp] = useState<number>(gameRoom?.state.victoryPointsToWin || 0)
  useEffect(() => {
    if (!gameRoom) return
    gameRoom.state.listen('victoryPointsToWin', (value) => setVp(value))
  }, [gameRoom])
  return vp
}
