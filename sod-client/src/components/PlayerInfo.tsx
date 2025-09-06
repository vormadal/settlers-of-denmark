import { Box, Typography } from '@mui/material'
import { Player } from '../state/Player'
import { useCurrentPlayer, useDeck } from '../hooks/stateHooks'
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
  const isActivePlayer = currentPlayer?.id === player.id
  const isMobile = width < 250 // Compact mode for smaller widths

  const developmentCardsCount = cards.filter((x) => x.type === 'Development' && x.owner === player.id).length
  const resourceCardsCount = cards.filter((x) => x.type === 'Resource' && x.owner === player.id).length
  const availableRoads = player.roads.filter((x) => !x.edge).length
  const availableSettlements = player.settlements.filter((x) => !x.intersection).length
  const availableCities = player.cities.filter((x) => !x.intersection).length

  return (
    <Box
      component="section"
      sx={{
        width: `${width}px`,
        minWidth: isMobile ? '180px' : '250px',
        background: isActivePlayer 
          ? `linear-gradient(145deg, ${color} 0%, ${color}DD 50%, #FFEB3B33 100%)`
          : `linear-gradient(145deg, ${color} 0%, ${color}CC 100%)`,
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '6px' : '12px',
        boxShadow: isActivePlayer
          ? '0 8px 25px rgba(255,235,59,0.4), 0 0 20px rgba(255,107,107,0.3)'
          : '0 6px 15px rgba(0,0,0,0.15)',
        border: isActivePlayer ? `2px solid #FFB347` : `1px solid rgba(255,255,255,0.5)`,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden',
        animation: isActivePlayer ? 'subtle-pulse 3s ease-in-out infinite' : 'none',
        flexShrink: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
          borderRadius: isMobile ? '12px 12px 0 0' : '16px 16px 0 0',
          pointerEvents: 'none',
        },
        '@keyframes subtle-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 8px 25px rgba(255,235,59,0.4), 0 0 20px rgba(255,107,107,0.3)'
          },
          '50%': { 
            transform: 'scale(1.02)',
            boxShadow: '0 12px 30px rgba(255,235,59,0.5), 0 0 25px rgba(255,107,107,0.4)'
          },
        },
      }}
    >
      {/* Stats Row */}
      <Box
        sx={{
          display: 'flex',
          gap: isMobile ? '2px' : '4px',
          marginBottom: isMobile ? '4px' : '8px',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'nowrap', // Prevent wrapping with smaller cards
        }}
      >
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
          <RoadIcon size={isMobile ? 12 : 16} color="#8B4513" />
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
      </Box>

      {/* Player Name */}
      <Box
        sx={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant={isMobile ? "body2" : "h6"}
          sx={{
            color: 'rgba(0,0,0,0.85)',
            textShadow: '0 2px 4px rgba(255,255,255,0.8)',
            fontWeight: 700,
            fontSize: isActivePlayer 
              ? (isMobile ? '0.875rem' : '1.1rem') 
              : (isMobile ? '0.75rem' : '1rem'),
            transition: 'font-size 0.3s ease',
            lineHeight: 1.2,
          }}
        >
          {isActivePlayer ? '👑 ' : ''}{player.name}{isActivePlayer ? ' 👑' : ''}
        </Typography>
      </Box>
    </Box>
  )
}
