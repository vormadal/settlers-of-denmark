import { Box, Paper, Typography } from '@mui/material'
import { DevelopmentCardDeck } from './DevelopmentCardDeck'
import { DevelopmentCards } from './DevelopmentCards'
import { DevelopmentCard } from './development/DevelopmentCard'
import { useCanBuyDevelopmentCards, useCanPlayDevelopmentCards, useCanPlayKnightDevelopmentCard, useCurrentRound, useDevelopmentDeckCount } from '../../hooks/stateHooks'
import { useRoom } from '../../context/RoomContext'
import { usePlayer } from '../../context/PlayerContext'
import { Card } from '../../state/Card'
import { CardTypes } from '../../utils/CardTypes'
import { CardVariants } from '../../utils/CardVariants'

interface Props {
  onBuyDevelopmentCard?: () => void
  onPlayDevelopmentCard?: (cardId: string) => void
}

export function DevelopmentCardArea({ onBuyDevelopmentCard, onPlayDevelopmentCard }: Props) {
  const gameRoom = useRoom()
  const player = usePlayer()
  const canBuyDevelopmentCards = useCanBuyDevelopmentCards()
  const canPlayDevelopmentCards = useCanPlayDevelopmentCards()
  const canPlayKnightDevelopmentCard = useCanPlayKnightDevelopmentCard()
  const currentRound = useCurrentRound()
  const developmentDeckCount = useDevelopmentDeckCount()

  // Get player's cards (you may need to adjust this based on your actual card system)
  const playerCards = gameRoom?.state.deck.filter((card: Card) => 
    card.owner === player?.id && card.type === CardTypes.Development
  ) || []

  // Check if player can afford a development card (1 Ore, 1 Grain, 1 Wool)
  // This logic would need to be implemented based on your resource system
  const canAffordDevelopmentCard = true // Placeholder - implement based on your resource logic

  const handleBuyDevelopmentCard = () => {
    if (onBuyDevelopmentCard && canBuyDevelopmentCards && canAffordDevelopmentCard) {
      onBuyDevelopmentCard()
    }
  }

  const canPlayCard = (card: Card) => {
    if (card.boughtInTurn === currentRound) {
      return false
    }
    if (card.variant === CardVariants.Knight) {
      return canPlayDevelopmentCards || canPlayKnightDevelopmentCard
    }
    return canPlayDevelopmentCards
  }

  const handlePlayDevelopmentCard = (card: Card) => {
    if (onPlayDevelopmentCard && canPlayCard(card)) {
      onPlayDevelopmentCard(card.id)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 2 }}>
      {/* Development Card Deck - for buying */}
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Development Card Deck
        </Typography>
        <DevelopmentCardDeck
          remainingCards={developmentDeckCount}
          onClick={handleBuyDevelopmentCard}
          disabled={!canBuyDevelopmentCards}
          canAfford={canAffordDevelopmentCard}
          width={80}
          height={100}
        />
      </Paper>

      {/* Player's Development Cards */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <DevelopmentCards
          cards={playerCards}
          onCardClick={handlePlayDevelopmentCard}
          title="My Development Cards"
          disabled={!canPlayDevelopmentCards}
          currentRound={currentRound}
        />
      </Paper>

      {/* Demo of individual card types */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
          Development Card Types
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          justifyContent: 'center' 
        }}>
          <DevelopmentCard variant={CardVariants.Knight} width={80} height={120} />
          <DevelopmentCard variant={CardVariants.VictoryPoint} width={80} height={120} />
          <DevelopmentCard variant={CardVariants.RoadBuilding} width={80} height={120} />
          <DevelopmentCard variant={CardVariants.Monopoly} width={80} height={120} />
          <DevelopmentCard variant={CardVariants.YearOfPlenty} width={80} height={120} />
          <DevelopmentCard variant={CardVariants.Merchant} width={80} height={120} />
        </Box>
      </Paper>
    </Box>
  )
}