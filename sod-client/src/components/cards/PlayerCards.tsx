import { Box } from '@mui/material'
import { Player } from '../../state/Player'
import { CardGroup } from './CardGroup'
import { colors } from '../../utils/colors'
import { useGameState } from '../../context/GameStateContext'

interface Props {
  player: Player
}
export function PlayerCards({ player }: Props) {
  const [state] = useGameState()

  if(!state) return null
  
  const resourceCards = state?.deck.filter((x) => x.owner === player.id && x.type === 'Resource')
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
