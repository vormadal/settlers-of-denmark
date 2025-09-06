import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { Player } from "../../state/Player";
import { colors } from "../../utils/colors";
import { CardVariants } from "../../utils/CardVariants";
import { useDeck } from "../../hooks/stateHooks";
import { CardGroup } from "./CardGroup";
import { BaseCard } from "./BaseCard";

interface Props {
  player: Player;
  open: boolean;
  onClose: () => void;
  initialResourceType?: string;
}

interface TradeGroup {
  resourceType: string;
  count: 4; // Always groups of 4
}

interface ReceivingCount {
  [resourceType: string]: number;
}

export function BankTradeModal({
  player,
  open,
  onClose,
  initialResourceType,
}: Props) {
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

  // Trading state
  const [givingGroups, setGivingGroups] = useState<TradeGroup[]>([]);
  const [receivingCounts, setReceivingCounts] = useState<ReceivingCount>({});

  // Initialize with initial resource type if provided
  const initializeWithResource = (resourceType: string) => {
    const availableCount = playerResourceCards.filter(
      (x) => x.variant === resourceType
    ).length;
    if (availableCount >= 4) {
      setGivingGroups([{ resourceType, count: 4 as const }]);
      setReceivingCounts({}); // Start with empty receiving counts
    }
  };

  // Reset state when modal opens
  const handleOpen = () => {
    if (initialResourceType && open) {
      initializeWithResource(initialResourceType);
    } else if (open) {
      setGivingGroups([]);
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
    const currentlyGiving =
      givingGroups.filter((group) => group.resourceType === resourceType)
        .length * 4;

    if (currentlyGiving + 4 <= availableCount) {
      const newGroups = [...givingGroups, { resourceType, count: 4 as const }];
      setGivingGroups(newGroups);
    }
  };

  const handleRemoveGivingGroup = (index: number) => {
    const newGroups = givingGroups.filter((_, i) => i !== index);
    setGivingGroups(newGroups);

    // Adjust receiving counts if we now can't receive as much
    const maxReceivable = newGroups.length;
    const currentReceiving = Object.values(receivingCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    if (currentReceiving > maxReceivable) {
      // Proportionally reduce receiving amounts
      const newReceivingCounts: ReceivingCount = {};
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
    if (totalReceiving <= givingGroups.length) {
      const newReceivingCounts = { ...receivingCounts };
      if (newCount === 0) {
        delete newReceivingCounts[resourceType];
      } else {
        newReceivingCounts[resourceType] = newCount;
      }
      setReceivingCounts(newReceivingCounts);
    }
  };

  const totalGivingResources = givingGroups.length * 4;
  const totalReceivingResources = Object.values(receivingCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const canReceiveCount = givingGroups.length;
  const isTradeValid =
    givingGroups.length > 0 && totalReceivingResources === givingGroups.length;

  const handleTrade = () => {
    if (isTradeValid) {
      // TODO: Send trade message to server
      console.log("Trading:", {
        giving: givingGroups,
        receiving: receivingCounts,
        totalGiving: totalGivingResources,
        totalReceiving: totalReceivingResources,
      });
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        p: isMobile ? 1 : 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: isMobile ? "100%" : "800px",
          maxHeight: "80vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Trade with Bank
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2 }}>
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
                  const givingCount =
                    givingGroups.filter(
                      (group) => group.resourceType === variant
                    ).length * 4;
                  const availableCount = totalCount - givingCount;

                  return availableCount > 0 ? (
                    <Box key={variant} sx={{ textAlign: "center" }}>
                      <Box
                        onClick={() => {
                          if (availableCount >= 4) {
                            handleAddGivingResource(variant);
                          }
                        }}
                        sx={{
                          cursor:
                            availableCount >= 4 ? "pointer" : "not-allowed",
                          opacity: availableCount >= 4 ? 1 : 0.5,
                          "&:hover":
                            availableCount >= 4
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
                          cursor: maxCanReceive > 0 ? "pointer" : "not-allowed",
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
                  givingGroups.length > 0
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
                {givingGroups.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontStyle: "italic" }}
                  >
                    Click your resources above
                  </Typography>
                ) : (
                  givingGroups.map((group, index) => (
                    <Box key={index} sx={{ textAlign: "center" }}>
                      <Box
                        onClick={() => handleRemoveGivingGroup(index)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { transform: "scale(1.1)" },
                          transition: "all 0.2s",
                        }}
                      >
                        <CardGroup
                          color={colors[group.resourceType]}
                          count={4}
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
        </Box>
      </Box>
    </Modal>
  );
}
