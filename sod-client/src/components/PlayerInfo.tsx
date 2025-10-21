import { Box, Typography, Chip } from '@mui/material'
import { Player } from '../state/Player'
import { useCurrentPlayer, useDeck, usePlayers, useHasLongestRoad, useHasLargestArmy } from '../hooks/stateHooks'
import { usePlayer } from '../context/PlayerContext'
import { CartoonStatCard } from './CartoonStatCard'
import { DevelopmentIcon, ResourceIcon, RoadIcon, SettlementIcon, CityIcon } from './icons'
import { KnightIcon } from './icons/KnightIcon'

interface Props {
  width: number
  player: Player
  color: string
}

export function PlayerInfo({ width, player, color }: Props) {
  const cards = useDeck()
  const currentPlayer = useCurrentPlayer()
  const currentUser = usePlayer() // The logged-in user
  const players = usePlayers()
  const isActivePlayer = currentPlayer?.id === player.id
  const isCurrentUser = currentUser?.id === player.id // Check if this is the current user's player
  const longestRoadOwner = useHasLongestRoad()
  const largestArmyOwner = useHasLargestArmy()
  const hasLongestRoad = longestRoadOwner === player.id && player.longestRoadLength > 0
  const hasLargestArmy = largestArmyOwner === player.id && player.knightsPlayed > 0
  const isMobile = width < 280 // Adjusted threshold for compact mode
  
  // Calculate victory points - show secret VPs only for current user
  const publicVP = player.victoryPoints ?? 0
  const secretVP = player.secretVictoryPoints ?? 0
  const displayVP = isCurrentUser ? publicVP + secretVP : publicVP
  const hasSecretVP = isCurrentUser && secretVP > 0
  
  const maxVP = players.length ? Math.max(...players.map(p => p.victoryPoints ?? 0)) : 0
  const isVpLeader = publicVP === maxVP && maxVP > 0

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
        minWidth: isMobile ? '220px' : '300px', // Increased minimum widths
        background: isActivePlayer 
          ? `linear-gradient(145deg, ${color}E6 0%, ${color}CC 50%, #FFEB3B44 100%)`
          : `linear-gradient(145deg, ${color}E6 0%, ${color}B3 100%)`,
        borderRadius: isMobile ? '12px' : '16px',
        // Reduced vertical padding
        p: isMobile ? '6px 8px 6px' : '10px 14px 10px', // Increased horizontal padding
        boxShadow: isActivePlayer
          ? '0 8px 25px rgba(255,235,59,0.4), 0 0 20px rgba(255,107,107,0.3), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 6px 15px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
        border: isActivePlayer ? `2px solid #FFB347` : `1px solid rgba(255,255,255,0.6)`,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden', // keep gradient mask effect
        animation: isActivePlayer ? 'subtle-pulse 3s ease-in-out infinite' : 'none',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backdropFilter: 'blur(1px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
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
          gap: isMobile ? '3px' : '5px', // Increased gap slightly
          marginBottom: isMobile ? '2px' : '4px', // Reduced margin
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
          count={player.knightsPlayed || 0}
          label={hasLargestArmy ? 'Largest Army' : 'Knights Played'}
          compact={isMobile}
        >
          <KnightIcon size={isMobile ? 12 : 16} color={hasLargestArmy ? '#9C27B0' : '#8B4513'} />
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
      </Box>

      {/* Player Name (Line 1) */}
      <Box sx={{ textAlign: 'center', zIndex: 1, position: 'relative', mb: isMobile ? 0.25 : 0.5 }}> {/* Reduced margin */}
        <Typography
          variant={isMobile ? 'body2' : 'h6'}
          sx={{
            color: 'rgba(0,0,0,0.85)',
            textShadow: '0 2px 4px rgba(255,255,255,0.8)',
            fontWeight: 700,
            fontSize: isActivePlayer
              ? (isMobile ? '0.85rem' : '1.1rem') // Slightly smaller font sizes
              : (isMobile ? '0.7rem' : '0.95rem'),
            transition: 'font-size 0.3s ease',
            lineHeight: 1.1, // Tighter line height
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={player.name}
        >
          {isVpLeader ? '👑 ' : ''}{player.name}{isVpLeader ? ' 👑' : ''}
        </Typography>
      </Box>

      {/* VP & Badges Row (Line 2) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '3px' : '6px', // Slightly reduced gap
          flexWrap: 'nowrap',
          alignItems: 'center',
          zIndex: 1,
          mb: 0, // Removed bottom margin
          minHeight: isMobile ? 24 : 28 // Reduced height
        }}
      >
        <Chip
          size={isMobile ? 'small' : 'medium'}
          label={hasSecretVP ? `${displayVP} VP (${publicVP}+${secretVP}🔒)` : `${displayVP} VP`}
          color={isVpLeader ? 'warning' : 'default'}
          sx={{
            fontWeight: 700,
            fontSize: isMobile ? '0.7rem' : '0.8rem', // Slightly smaller font
            bgcolor: isVpLeader ? 'warning.light' : hasSecretVP ? 'rgba(255,215,0,0.85)' : 'rgba(255,255,255,0.85)',
            color: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(0,0,0,0.12)',
            boxShadow: hasSecretVP ? '0 0 6px rgba(255,215,0,0.5)' : '0 1px 3px rgba(0,0,0,0.15)'
          }}
        />
        {hasLongestRoad && (
          <Chip
            size={isMobile ? 'small' : 'medium'}
            label={`🚗 ${player.longestRoadLength}`}
            color="warning"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? '0.7rem' : '0.8rem', // Slightly smaller font
              bgcolor: '#FF9800',
              color: '#212121',
              border: '1px solid rgba(0,0,0,0.15)',
              boxShadow: '0 0 6px rgba(255,152,0,0.45)'
            }}
          />
        )}
        {hasLargestArmy && (
          <Chip
            size={isMobile ? 'small' : 'medium'}
            label={`⚔️ ${player.knightsPlayed}`}
            color="secondary"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? '0.7rem' : '0.8rem', // Slightly smaller font
              bgcolor: '#9C27B0',
              color: '#FAFAFA',
              border: '1px solid rgba(0,0,0,0.15)',
              boxShadow: '0 0 6px rgba(156,39,176,0.45)'
            }}
          />
        )}
      </Box>
    </Box>
  )
}
