import { Player } from '../state/Player'
import { useCurrentPlayer, useDeck, usePlayers, useHasLongestRoad } from '../hooks/stateHooks'
import { CartoonStatCard } from './CartoonStatCard'
import { DevelopmentIcon, ResourceIcon, RoadIcon, SettlementIcon, CityIcon } from './icons'

interface Props {
  width: number
  player: Player
  color: string
}

export function PlayerInfo({ width, player, color }: Props) {
  const cards = useDeck()
  const currentPlayer = useCurrentPlayer()
  const players = usePlayers()
  const isActivePlayer = currentPlayer?.id === player.id
  const longestRoadOwner = useHasLongestRoad()
  const hasLongestRoad = longestRoadOwner === player.id && player.longestRoadLength > 0
  const isMobile = width < 250 // Compact mode for smaller widths
  const maxVP = players.length ? Math.max(...players.map(p => p.victoryPoints ?? 0)) : 0
  const isVpLeader = (player.victoryPoints ?? 0) === maxVP && maxVP > 0

  const developmentCardsCount = cards.filter((x) => x.type === 'Development' && x.owner === player.id).length
  const resourceCardsCount = cards.filter((x) => x.type === 'Resource' && x.owner === player.id).length
  const availableRoads = player.roads.filter((x) => !x.edge).length
  const availableSettlements = player.settlements.filter((x) => !x.intersection).length
  const availableCities = player.cities.filter((x) => !x.intersection).length

  return (
    <section
      className={`
        flex-shrink-0 relative overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isMobile ? 'min-w-[180px] rounded-xl p-1.5' : 'min-w-[250px] rounded-2xl p-3'}
        ${isActivePlayer 
          ? 'border-2 border-orange-300 animate-subtle-pulse' 
          : 'border border-white/50'
        }
      `}
      style={{
        width: `${width}px`,
        background: isActivePlayer 
          ? `linear-gradient(145deg, ${color} 0%, ${color}DD 50%, #FFEB3B33 100%)`
          : `linear-gradient(145deg, ${color} 0%, ${color}CC 100%)`,
        boxShadow: isActivePlayer
          ? '0 8px 25px rgba(255,235,59,0.4), 0 0 20px rgba(255,107,107,0.3)'
          : '0 6px 15px rgba(0,0,0,0.15)',
      }}
    >
      {/* Gloss overlay */}
      <div 
        className={`absolute top-0 left-0 right-0 h-[40%] pointer-events-none ${
          isMobile ? 'rounded-t-xl' : 'rounded-t-2xl'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Stats Row */}
      <div className={`
        flex justify-center flex-nowrap relative z-10
        ${isMobile ? 'gap-0.5 mb-1' : 'gap-1 mb-2'}
      `}>
        <CartoonStatCard
          count={developmentCardsCount}
          label="Development Cards"
          compact={isMobile}
        >
          <DevelopmentIcon size={isMobile ? 12 : 16} color="#8B4513" />
        </CartoonStatCard>
        <CartoonStatCard
          count={resourceCardsCount}
          label="Resource Cards"
          compact={isMobile}
        >
          <ResourceIcon size={isMobile ? 12 : 16} color="#D2691E" />
        </CartoonStatCard>
        <CartoonStatCard
          count={availableRoads}
          label="Available Roads"
          compact={isMobile}
        >
          <RoadIcon size={isMobile ? 12 : 16} color={hasLongestRoad ? '#FF9800' : '#8B4513'} />
        </CartoonStatCard>
        <CartoonStatCard
          count={player.longestRoadLength || 0}
          label={hasLongestRoad ? 'Longest Road' : 'Road Length'}
          compact={isMobile}
        >
          <RoadIcon size={isMobile ? 12 : 16} color={hasLongestRoad ? '#FF5722' : '#A0522D'} />
        </CartoonStatCard>
        <CartoonStatCard
          count={availableSettlements}
          label="Available Settlements"
          compact={isMobile}
        >
          <SettlementIcon size={isMobile ? 12 : 16} color="#DEB887" />
        </CartoonStatCard>
        <CartoonStatCard
          count={availableCities}
          label="Available Cities"
          compact={isMobile}
        >
          <CityIcon size={isMobile ? 12 : 16} color="#708090" />
        </CartoonStatCard>
      </div>

      {/* Player Name */}
      <div className="text-center relative z-10">
        <div className={`inline-flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
          <span
            className={`
              text-black/85 font-bold transition-all duration-300 leading-tight
              ${isActivePlayer 
                ? (isMobile ? 'text-sm' : 'text-h6') 
                : (isMobile ? 'text-xs' : 'text-base')
              }
            `}
            style={{ textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}
          >
            {isVpLeader ? '👑 ' : ''}{player.name}{isVpLeader ? ' 👑' : ''}
          </span>
          <span
            className={`
              inline-flex items-center justify-center font-bold border border-black/10 rounded-full px-2 py-1
              ${isMobile ? 'text-xs h-5' : 'text-sm h-6'}
              ${isVpLeader 
                ? 'bg-yellow-300 text-black/80' 
                : 'bg-white/80 text-black/80'
              }
            `}
          >
            {player.victoryPoints ?? 0} VP
          </span>
          {hasLongestRoad && (
            <span
              className={`
                inline-flex items-center justify-center font-bold border border-black/15 rounded-full px-2 py-1
                bg-orange-500 text-gray-800 shadow-[0_0_8px_rgba(255,152,0,0.6)]
                ${isMobile ? 'text-xs h-5' : 'text-sm h-6'}
              `}
            >
              🚗 {player.longestRoadLength}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
