import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Player } from '../../state/Player'
import { CardGroup, CARD_WIDTH, MIN_SPACING, DEFAULT_MAX_SPACING } from './CardGroup'
import { colors } from '../../utils/colors'
import { useDeck } from '../../hooks/stateHooks'
import { useEffect, useRef, useState } from 'react'

interface Props {
  player: Player
}
export function PlayerCards({ player }: Props) {
  const deck = useDeck()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const containerRef = useRef<HTMLDivElement>(null)
  const [optimalSpacing, setOptimalSpacing] = useState(DEFAULT_MAX_SPACING)

  const resourceCards = deck.filter((x) => x.owner === player.id && x.type === 'Resource')
  // Get all the unique variants of the resource cards
  const resourceVariants = [...new Set(resourceCards.map((x) => x.variant).sort((a, b) => a.localeCompare(b)))]
  
  // Calculate card counts for each variant
  const cardCounts = resourceVariants.map(variant => 
    resourceCards.filter((x) => x.variant === variant).length
  )

  // Calculate optimal spacing to fit all cards
  useEffect(() => {
    if (!containerRef.current || resourceVariants.length === 0) return

    const containerWidth = containerRef.current.offsetWidth
    const marginBetweenGroups = 8 // 0.5rem in pixels (approximately)
    const totalMargins = (resourceVariants.length - 1) * marginBetweenGroups
    
    // Calculate total width needed for all card groups
    const calculateTotalWidth = (spacing: number) => {
      return cardCounts.reduce((total, count) => {
        const groupWidth = CARD_WIDTH + (count - 1) * spacing
        return total + groupWidth
      }, 0) + totalMargins
    }

    // Find the maximum spacing that fits in the container
    let testSpacing = DEFAULT_MAX_SPACING
    while (testSpacing >= MIN_SPACING && calculateTotalWidth(testSpacing) > containerWidth) {
      testSpacing -= 0.5
    }
    
    setOptimalSpacing(Math.max(MIN_SPACING, testSpacing))
  }, [resourceVariants.length, cardCounts, containerRef.current?.offsetWidth])

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'flex', 
        overflow: 'hidden', // Remove scrolling
        minWidth: 0,
        height: '70px',
        alignItems: 'flex-end',
        width: '100%', // Ensure it takes full width
      }}
    >
      {resourceVariants.map((variant) => (
        <CardGroup
          key={variant}
          color={colors[variant]}
          count={resourceCards.filter((x) => x.variant === variant).length}
          maxSpacing={optimalSpacing}
        />
      ))}
    </Box>
  )
}
