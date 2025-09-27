import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useCurrentPlayer, useDeck, usePhase, useCanPlayDevelopmentCards, useCanPlayKnightDevelopmentCard, useCurrentRound } from "../../hooks/stateHooks";
import { Player } from "../../state/Player";
import { Card } from "../../state/Card";
import { CardTypes } from "../../utils/CardTypes";
import { CardVariants } from "../../utils/CardVariants";
import { useRoom } from "../../context/RoomContext";
import { DevelopmentCard } from "./development/DevelopmentCard";

interface Props {
  player: Player;
}

const cardWidth = 40;
const cardHeight = 60;
const minSpacing = 1;
const defaultMaxSpacing = 8;

export function PlayerDevelopmentCards({ player }: Props) {
  const deck = useDeck();
  const currentPlayer = useCurrentPlayer();
  const phase = usePhase();
  const canPlayDevelopmentCards = useCanPlayDevelopmentCards();
  const canPlayKnightCard = useCanPlayKnightDevelopmentCard();
  const currentRound = useCurrentRound();
  const room = useRoom();
  const containerRef = useRef<HTMLDivElement>(null);
  const [optimalSpacing, setOptimalSpacing] = useState(defaultMaxSpacing);

  const developmentCards = deck.filter(
    (x) => x.owner === player.id && x.type === CardTypes.Development
  );

  // Get all unique variants of development cards, sorted
  const developmentVariants = [
    ...new Set(
      developmentCards.map((x) => x.variant).sort((a, b) => a.localeCompare(b))
    ),
  ];

  // Calculate card counts for each variant
  const cardCounts = developmentVariants.map(
    (variant) => developmentCards.filter((x) => x.variant === variant).length
  );

  // Check if player can play cards (is current player and in turn phase)
  const isCurrentPlayer = currentPlayer?.id === player.id;
  const canPlayNormally = isCurrentPlayer && phase.key === "turn" && canPlayDevelopmentCards;
  const canPlayKnight = isCurrentPlayer && canPlayKnightCard;

  // Check if a variant can be played (has at least one card not bought this turn)
  const canPlayVariant = (variant: string): { canPlay: boolean; playableCard: Card | null } => {
    const isKnight = variant === CardVariants.Knight;
    const canPlayForVariant = isKnight ? (canPlayNormally || canPlayKnight) : canPlayNormally;

    if (!canPlayForVariant) {
      return { canPlay: false, playableCard: null };
    }

    const cards = developmentCards.filter((x) => x.variant === variant);
    const playableCard = cards.find(card => card.boughtInTurn !== currentRound);

    return { canPlay: !!playableCard, playableCard: playableCard || null };
  };

  const handleCardClick = (variant: string) => {
    const { canPlay: variantCanPlay, playableCard } = canPlayVariant(variant);
    if (variantCanPlay && playableCard) {
      room?.send('PLAY_DEVELOPMENT_CARD', { cardId: playableCard.id });
    }
  };

  // Calculate optimal spacing to fit all cards (similar logic to PlayerCards)
  useEffect(() => {
    if (!containerRef.current || developmentVariants.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const marginBetweenGroups = 8; // 0.5rem in pixels (approximately)
    const totalMargins = (developmentVariants.length - 1) * marginBetweenGroups;

    // Calculate total width needed for all card groups
    const calculateTotalWidth = (spacing: number) => {
      return (
        cardCounts.reduce((total, count) => {
          const groupWidth = cardWidth + (count - 1) * spacing;
          return total + groupWidth;
        }, 0) + totalMargins
      );
    };

    // Find the maximum spacing that fits in the container
    let testSpacing = defaultMaxSpacing;
    while (
      testSpacing >= minSpacing &&
      calculateTotalWidth(testSpacing) > containerWidth
    ) {
      testSpacing -= 0.5;
    }

    setOptimalSpacing(Math.max(minSpacing, testSpacing));
  }, [developmentVariants.length, cardCounts, containerRef.current?.offsetWidth]);

  // Don't render if no development cards
  if (developmentCards.length === 0) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        overflow: "hidden",
        minWidth: 0,
        height: "70px",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 1, // Add some spacing above development cards
      }}
    >
      {developmentVariants.map((variant) => {
        const count = developmentCards.filter((x) => x.variant === variant).length;
        const { canPlay: variantCanPlay } = canPlayVariant(variant);
        
        return (
          <DevelopmentCardGroup
            key={variant}
            variant={variant}
            count={count}
            maxSpacing={optimalSpacing}
            onClick={variantCanPlay ? () => handleCardClick(variant) : undefined}
            disabled={!variantCanPlay}
          />
        );
      })}
    </Box>
  );
}

// Component for displaying a group of development cards (similar to CardGroup but for development cards)
interface DevelopmentCardGroupProps {
  variant: string;
  count: number;
  maxSpacing: number;
  onClick?: () => void;
  disabled?: boolean;
}

function DevelopmentCardGroup({ variant, count, maxSpacing, onClick, disabled }: DevelopmentCardGroupProps) {
  const spacing = Math.min(maxSpacing, 6); // Max spacing of 6 for development cards
  const containerWidth = cardWidth + (count - 1) * spacing;

  return (
    <Box
      sx={{
        position: "relative",
        width: `${containerWidth}px`,
        height: `${cardHeight}px`,
        marginRight: 1,
        cursor: onClick && !disabled ? "pointer" : "default",
        '&:hover': onClick && !disabled ? {
          '& .dev-card': {
            transform: 'translateY(-2px)',
          }
        } : {},
      }}
      onClick={onClick && !disabled ? onClick : undefined}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          className="dev-card"
          sx={{
            position: "absolute",
            left: `${index * spacing}px`,
            transition: 'transform 0.2s ease',
            zIndex: index + 1, // Stack cards same way as resource cards (first card at back, later cards on top)
          }}
        >
          <DevelopmentCard
            variant={variant}
            width={cardWidth}
            height={cardHeight}
            disabled={disabled}
          />
        </Box>
      ))}
      
      {/* Count badge for multiple cards */}
      {count > 1 && (
        <Box
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            backgroundColor: disabled ? '#757575' : '#2196F3',
            color: 'white',
            borderRadius: "50%",
            minWidth: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: "bold",
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}