import { Box } from '@mui/material'
import { Player } from '../../state/Player'
import { CardGroup } from './CardGroup'
import { colors } from '../../utils/colors'
import { useDeck } from '../../hooks/stateHooks'

interface Props {
  player: Player
}
export function PlayerCards({ player }: Props) {
  const deck = useDeck()

  const resourceCards = deck.filter((x) => x.owner === player.id && x.type === 'Resource')
  // Get all the unique variants of the resource cards
  const resourceVariants = [...new Set(resourceCards.map((x) => x.variant).sort((a, b) => a.localeCompare(b)))]
  return (
    <Box sx={{ display: 'flex' }}>
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
