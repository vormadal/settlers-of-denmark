import { Box, Typography } from '@mui/material'
import { Player } from '../state/Player'
import { BaseCard } from './cards/BaseCard'
import { useCurrentPlayer, useDeck } from '../hooks/stateHooks'

interface Props {
  width: number
  player: Player
  color: string
}

export function PlayerInfo({ width, player, color }: Props) {
  const cards = useDeck()
  const currentPlayer = useCurrentPlayer()
  return (
    <Box
      component="section"
      sx={{
        border: currentPlayer?.id === player.id ? '2px solid rgba(160, 0, 0, 0.7)' : 'none',
        minHeight: '50px',
        background: color,
        borderRadius: '1rem',
        padding: '0.5rem',
        display: 'flex'
      }}
    >
      <Box sx={{ position: 'relative', width: 30 }}>
        <BaseCard
          height={50}
          width={25}
        >
          <span>D</span>
          <br></br>
          {cards.filter((x) => x.type === 'Development' && x.owner === player.id).length}
        </BaseCard>
      </Box>
      <Box sx={{ position: 'relative', width: 30 }}>
        <BaseCard
          height={50}
          width={25}
        >
          <span>R</span>
          <br></br>
          {cards.filter((x) => x.type === 'Resource' && x.owner === player.id).length}
        </BaseCard>
      </Box>
      <Box>
        <Typography variant="body1">{player.name}</Typography>
        <Typography variant="body1">
          {player.roads.filter((x) => !x.edge).length}R {player.settlements.filter((x) => !x.intersection).length}S{' '}
          {player.cities.filter((x) => !x.intersection).length}C
        </Typography>
      </Box>
    </Box>
  )
}
