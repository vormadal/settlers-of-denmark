import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Player } from "../../state/Player";
import { colors } from "../../utils/colors";
import { CardVariants } from "../../utils/CardVariants";
import { useDeck } from "../../hooks/stateHooks";
import { CardGroup } from "./CardGroup";
import { BaseCard } from "./BaseCard";
import { useRoom } from "../../context/RoomContext";
import { GameModal } from "../GameModal";

interface Props {
  player: Player;
  open: boolean;
  onClose: () => void;
  initialResourceType?: string;
}

interface ResourceGroup {
  [resourceType: string]: number;
}

export function BankTradeModal({
  player,
  open,
  onClose,
  initialResourceType,
}: Props) {
  const room = useRoom();
  const deck = useDeck();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get player's resource cards
  const playerResourceCards = deck.filter(
    (x) => x.owner === player.id && x.type === "Resource"
  );
  const resourceVariants = [
    CardVariants.Lumber,
    CardVariants.Wool,
    CardVariants.Grain,
    CardVariants.Ore,
    CardVariants.Brick,
  ];

  // Helper to get dynamic exchange ratio for a resource (harbor aware)
  const getResourceRatio = (resourceType: string) => {
    const ratio = player.exchangeRate.get(resourceType);
    if (!ratio) {
      return 4;
    }

    return ratio.ratio;
  };

  // Trading state
  const [givingCounts, setGivingCounts] = useState<ResourceGroup>({});
  const [receivingCounts, setReceivingCounts] = useState<ResourceGroup>({});

  // Initialize with initial resource type if provided
  const initializeWithResource = (resourceType: string) => {
    const availableCount = playerResourceCards.filter(
      (x) => x.variant === resourceType
    ).length;
    const ratio = getResourceRatio(resourceType);
    if (availableCount >= ratio) {
      setGivingCounts({ [resourceType]: ratio });
      setReceivingCounts({}); // Start with empty receiving counts
    }
  };

  // Reset state when modal opens
  const handleOpen = () => {
    if (initialResourceType && open) {
      initializeWithResource(initialResourceType);
    } else if (open) {
      setGivingCounts({});
      setReceivingCounts({});
    }
  };

  // Effect to handle initialization
  React.useEffect(() => {
    handleOpen();
  }, [open, initialResourceType]);

  const handleAddGivingResource = (resourceType: string) => {
    const availableCount = playerResourceCards.filter(
      (x) => x.variant === resourceType
    ).length;
    const currentlyGiving = givingCounts[resourceType] || 0;

    const ratio = getResourceRatio(resourceType);
    if (currentlyGiving + ratio <= availableCount) {
      const newGroups = {
        ...givingCounts,
        [resourceType]: (givingCounts[resourceType] || 0) + ratio,
      };
      setGivingCounts(newGroups);
    }
  };

  const handleRemoveGivingGroup = (resourceType: string) => {
    const newGroups = { ...givingCounts };
    delete newGroups[resourceType];
    setGivingCounts(newGroups);

    // Adjust receiving counts if we now can't receive as much
    const maxReceivable = Object.keys(newGroups).length;
    const currentReceiving = Object.values(receivingCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    if (currentReceiving > maxReceivable) {
      // Proportionally reduce receiving amounts
      const newReceivingCounts: ResourceGroup = {};
      let remaining = maxReceivable;
      for (const [resourceType, count] of Object.entries(receivingCounts)) {
        if (remaining > 0 && count > 0) {
          const newCount = Math.min(count, remaining);
          newReceivingCounts[resourceType] = newCount;
          remaining -= newCount;
        }
      }
      setReceivingCounts(newReceivingCounts);
    }
  };

  const handleChangeReceivingCount = (resourceType: string, delta: number) => {
    const currentCount = receivingCounts[resourceType] || 0;
    const newCount = Math.max(0, currentCount + delta);

    // Calculate total receiving after this change
    const totalReceiving = Object.values(receivingCounts).reduce(
      (sum, count, index) => {
        if (Object.keys(receivingCounts)[index] === resourceType) {
          return sum + newCount;
        }
        return sum + count;
      },
      0
    );

    // Only allow if we don't exceed available receiving capacity
    if (totalReceiving <= canReceiveCount) {
      const newReceivingCounts = { ...receivingCounts };
      if (newCount === 0) {
        delete newReceivingCounts[resourceType];
      } else {
        newReceivingCounts[resourceType] = newCount;
      }
      setReceivingCounts(newReceivingCounts);
    }
  };

  const totalGivingResources = Object.values(givingCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalReceivingResources = Object.values(receivingCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  // Capacity is sum of (cards committed / ratio for that resource)
  const canReceiveCount = Object.entries(givingCounts).reduce(
    (sum, [res, count]) => sum + count / getResourceRatio(res),
    0
  );
  const isTradeValid =
    totalGivingResources > 0 &&
    Number.isInteger(canReceiveCount) &&
    totalReceivingResources === canReceiveCount;

  const handleTrade = () => {
    if (isTradeValid) {
      room.send("BANK_TRADE", {
        give: Object.keys(givingCounts).map((key) => ({
          resourceType: key,
          amount: givingCounts[key],
        })),
        receive: Object.keys(receivingCounts).map((key) => ({
          resourceType: key,
          amount: receivingCounts[key],
        })),
      });
      onClose();
    }
  };

  return (
    <GameModal
      open={open}
      onClose={onClose}
      title="Trade with Bank"
      accentColor="#2196f3"
      maxWidth={false}
      fullWidth
      paperSx={{
        width: "100%",
        maxWidth: isMobile ? "100%" : 800,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
      }}
      contentSx={{
        p: 2,
        maxHeight: "70vh",
        overflowY: "auto",
      }}
      showCloseButton
    >
      {/* Trading Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: 1,
          minHeight: 200,
        }}
      >
        {/* Top Left - Player Available Resources */}
        <Box
          sx={{
            p: 1,
            backgroundColor: "rgba(33, 150, 243, 0.05)",
            borderRadius: 2,
            border: "2px solid rgba(33, 150, 243, 0.2)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}
          >
            Your Resources
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {resourceVariants.map((variant) => {
              const totalCount = playerResourceCards.filter(
                (x) => x.variant === variant
              ).length;
              const givingCount = givingCounts[variant] || 0;
              const availableCount = totalCount - givingCount;
              const ratio = getResourceRatio(variant);
              const canClick = availableCount >= ratio;

              return availableCount > 0 ? (
                <Box
                  key={variant}
                  sx={{ textAlign: "center", position: "relative" }}
                >
                  <Box
                    onClick={() => {
                      if (canClick) {
                        handleAddGivingResource(variant);
                      }
                    }}
                    sx={{
                      cursor: canClick ? "pointer" : "not-allowed",
                      opacity: canClick ? 1 : 0.5,
                      "&:hover": canClick
                        ? { transform: "scale(1.1)" }
                        : {},
                      transition: "all 0.2s",
                    }}
                  >
                    <CardGroup
                      color={colors[variant]}
                      count={availableCount}
                      maxSpacing={1.5}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        px: 0.5,
                        py: 0.1,
                        fontSize: 10,
                        borderRadius: 1,
                        zIndex: 999,
                        pointerEvents: "none",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                      }}
                    >
                      {ratio}:1
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {variant}
                  </Typography>
                </Box>
              ) : null;
            })}
          </Box>
        </Box>

        {/* Top Right - Bank Resources (Available to receive) */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(76, 175, 80, 0.05)",
            borderRadius: 2,
            border: "2px solid rgba(76, 175, 80, 0.2)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}
          >
            Bank Resources
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {resourceVariants.map((variant) => {
              const currentReceiving = receivingCounts[variant] || 0;
              const maxCanReceive =
                canReceiveCount -
                totalReceivingResources +
                currentReceiving;
              return (
                <Box key={variant} sx={{ textAlign: "center" }}>
                  <Box
                    onClick={() => {
                      if (maxCanReceive > 0) {
                        handleChangeReceivingCount(variant, 1);
                      }
                    }}
                    sx={{
                      cursor:
                        maxCanReceive > 0 ? "pointer" : "not-allowed",
                      opacity: maxCanReceive > 0 ? 1 : 0.5,
                      "&:hover":
                        maxCanReceive > 0
                          ? { transform: "scale(1.1)" }
                          : {},
                      transition: "all 0.2s",
                    }}
                  >
                    <BaseCard
                      color={colors[variant]}
                      width={40}
                      height={60}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {variant}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Bottom Left - Resources to Give */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(244, 67, 54, 0.05)",
            borderRadius: 2,
            border:
              Object.keys(givingCounts).length > 0
                ? "2px solid rgba(244, 67, 54, 0.6)"
                : "2px dashed #ccc",
            minHeight: 80,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 40,
            }}
          >
            {Object.keys(givingCounts).length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                Click your resources above
              </Typography>
            ) : (
              Object.entries(givingCounts).map(([resourceType, count]) => (
                <Box key={resourceType} sx={{ textAlign: "center" }}>
                  <Box
                    onClick={() => handleRemoveGivingGroup(resourceType)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.1)" },
                      transition: "all 0.2s",
                    }}
                  >
                    <CardGroup
                      color={colors[resourceType]}
                      count={count}
                      maxSpacing={1}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Bottom Right - Resources to Receive */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(76, 175, 80, 0.05)",
            borderRadius: 2,
            border:
              totalReceivingResources > 0
                ? "2px solid rgba(76, 175, 80, 0.6)"
                : "2px dashed #ccc",
            minHeight: 80,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 40,
            }}
          >
            {totalReceivingResources === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                Click bank resources above
              </Typography>
            ) : (
              Object.entries(receivingCounts).map(
                ([resourceType, count]) =>
                  count > 0 && (
                    <Box key={resourceType} sx={{ textAlign: "center" }}>
                      <Box
                        onClick={() =>
                          handleChangeReceivingCount(resourceType, -count)
                        }
                        sx={{
                          cursor: "pointer",
                          "&:hover": { transform: "scale(1.1)" },
                          transition: "all 0.2s",
                        }}
                      >
                        <CardGroup
                          color={colors[resourceType]}
                          count={count}
                          maxSpacing={1}
                        />
                      </Box>
                    </Box>
                  )
              )
            )}
          </Box>
        </Box>
      </Box>

      {/* Trade Status and Button */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {canReceiveCount > 0 &&
            `Offering ${totalGivingResources} card(s) = ${canReceiveCount} to receive`}
        </Typography>
        <Button
          variant="contained"
          disabled={!isTradeValid}
          onClick={handleTrade}
          sx={{
            backgroundColor: isTradeValid ? "#4caf50" : "#ccc",
            "&:hover": {
              backgroundColor: isTradeValid ? "#45a049" : "#ccc",
            },
          }}
        >
          Complete Trade
        </Button>
      </Box>
    </GameModal>
  );
}
