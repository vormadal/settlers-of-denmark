import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useCurrentPlayer, useDeck, usePhase, useCanPlayDevelopmentCards, useCurrentRound } from "../../hooks/stateHooks";
import { Player } from "../../state/Player";
import { Card } from "../../state/Card";
import { CardTypes } from "../../utils/CardTypes";
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
  const currentRound = useCurrentRound();
  const room = useRoom();
  const containerRef = useRef<HTMLDivElement>(null);
  const [optimalSpacing, setOptimalSpacing] = useState(defaultMaxSpacing);

  const developmentCards = deck.filter(
    (x) => x.owner === player.id && x.type === CardTypes.Development
  );

  // Unique variants, sorted for stable grouping
  const developmentVariants = [
    ...new Set(
      developmentCards.map((x) => x.variant).sort((a, b) => a.localeCompare(b))
    ),
  ];

  // Counts per variant
  const cardCounts = developmentVariants.map(
    (variant) => developmentCards.filter((x) => x.variant === variant).length
  );

  // Phase checks
  const isCurrentPlayer = currentPlayer?.id === player.id;
  const isTurnPhase = phase.key === "turn";
  const isRollPhase = room?.state.phase === "rollingDice";
  const canPlayNormally = isCurrentPlayer && isTurnPhase && canPlayDevelopmentCards;

  // Determine if a variant is playable and which specific card to play
  const canPlayVariant = (variant: string): { canPlay: boolean; playableCard: Card | null } => {
    if (!isCurrentPlayer) {
      return { canPlay: false, playableCard: null };
    }

    const cards = developmentCards.filter((x) => x.variant === variant);

    console.log(cards.map(c => (`phase: ${room?.state.phase}, type: ${c.variant}, boughtInTurn: ${c.boughtInTurn}, canBePlayedBeforeRoll: ${c.canBePlayedBeforeRoll}`)));

    // Normal turn phase: any card not bought this turn
    if (canPlayNormally) {
      const playableCard = cards.find((card) => card.boughtInTurn !== currentRound);
      return { canPlay: !!playableCard, playableCard: playableCard ?? null };
    }

    // Roll phase: only cards explicitly allowed pre-roll and not bought this turn
    if (isRollPhase) {
      const playableCard = cards.find(
        (card) => card.canBePlayedBeforeRoll && card.boughtInTurn !== currentRound
      );
      return { canPlay: !!playableCard, playableCard: playableCard ?? null };
    }

    return { canPlay: false, playableCard: null };
  };

  const handleCardClick = (variant: string) => {
    const { canPlay: variantCanPlay, playableCard } = canPlayVariant(variant);
    if (variantCanPlay && playableCard) {
      room?.send('PLAY_DEVELOPMENT_CARD', { cardId: playableCard.id });
    }
  };

  // Fit the card groups within the container
  useEffect(() => {
    if (!containerRef.current || developmentVariants.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const marginBetweenGroups = 8; // ~0.5rem
    const totalMargins = (developmentVariants.length - 1) * marginBetweenGroups;

    const calculateTotalWidth = (spacing: number) => {
      return (
        cardCounts.reduce((total, count) => {
          const groupWidth = cardWidth + (count - 1) * spacing;
          return total + groupWidth;
        }, 0) + totalMargins
      );
    };

    let testSpacing = defaultMaxSpacing;
    while (
      testSpacing >= minSpacing &&
      calculateTotalWidth(testSpacing) > containerWidth
    ) {
      testSpacing -= 0.5;
    }

    setOptimalSpacing(Math.max(minSpacing, testSpacing));
  }, [developmentVariants.length, cardCounts, containerRef.current?.offsetWidth]);

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
        marginTop: 1,
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

interface DevelopmentCardGroupProps {
  variant: string;
  count: number;
  maxSpacing: number;
  onClick?: () => void;
  disabled?: boolean;
}

function DevelopmentCardGroup({ variant, count, maxSpacing, onClick, disabled }: DevelopmentCardGroupProps) {
  const spacing = Math.min(maxSpacing, 6);
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
            zIndex: index + 1,
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