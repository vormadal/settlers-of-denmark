import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Player } from '../../state/Player'
import { CardGroup } from './CardGroup'
import { colors } from '../../utils/colors'
import { useDeck } from '../../hooks/stateHooks'

interface Props {
  player: Player
}
export function PlayerCards({ player }: Props) {
  const deck = useDeck()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const resourceCards = deck.filter((x) => x.owner === player.id && x.type === 'Resource')
  // Get all the unique variants of the resource cards
  const resourceVariants = [...new Set(resourceCards.map((x) => x.variant).sort((a, b) => a.localeCompare(b)))]
  return (
    <Box sx={{ 
      display: 'flex', 
      overflowX: 'auto', 
      overflowY: 'hidden',
      minWidth: 0,
      height: '48px', // Increased height to prevent cutting off cards
      alignItems: 'flex-end', // Align cards to bottom to show full card
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        height: isMobile ? 2 : 4,
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 2,
        '&:hover': {
          background: 'rgba(0,0,0,0.5)',
        },
      },
    }}>
      {resourceVariants.map((variant) => (
        <CardGroup
          key={variant}
          color={colors[variant]}
          count={resourceCards.filter((x) => x.variant === variant).length}
        />
      ))}
    </Box>
  )
}
