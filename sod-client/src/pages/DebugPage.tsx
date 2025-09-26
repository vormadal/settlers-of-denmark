import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useColyseus } from "../context/ColyseusContext";
import { RoomNames } from "../utils/RoomNames";
import { CardVariants } from "../utils/CardVariants";
import { useNavigate } from "react-router-dom";

interface GameConfiguration {
  debug: boolean;
  autoPlace: boolean;
  numPlayers: number;
  numSettlements: number;
  numCities: number;
  numRoads: number;
  defaultExchangeRate: number;
  resourceCards: {
    [key: string]: number;
  };
  initialPlayerResourceCards: {
    [key: string]: number;
  };
  name: string;
}

const STORAGE_KEY = "debug-page-config";

const defaultConfig: GameConfiguration = {
  debug: true,
  autoPlace: true,
  numPlayers: 2,
  numSettlements: 4,
  numCities: 4,
  numRoads: 19,
  defaultExchangeRate: 4,
  resourceCards: {
    [CardVariants.Brick]: 19,
    [CardVariants.Grain]: 19,
    [CardVariants.Lumber]: 19,
    [CardVariants.Ore]: 19,
    [CardVariants.Wool]: 19,
  },
  initialPlayerResourceCards: {
    [CardVariants.Brick]: 5,
    [CardVariants.Grain]: 5,
    [CardVariants.Lumber]: 5,
    [CardVariants.Ore]: 5,
    [CardVariants.Wool]: 5,
  },
  name: "Player",
};

function DebugPage() {
  const client = useColyseus();
  const navigate = useNavigate();

  // Helper functions for localStorage
  const loadConfigFromStorage = (): GameConfiguration => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default config to handle new fields or missing properties
        return { ...defaultConfig, ...parsed };
      }
    } catch (error) {
      console.warn("Failed to load config from localStorage:", error);
    }
    return defaultConfig;
  };

  const saveConfigToStorage = (config: GameConfiguration) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn("Failed to save config to localStorage:", error);
    }
  };

  const [config, setConfig] = useState<GameConfiguration>(
    loadConfigFromStorage
  );
  const [isCreating, setIsCreating] = useState(false);

  // Save to localStorage whenever config changes
  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  const handleConfigChange = (field: keyof GameConfiguration, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResourceCardChange = (resource: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      resourceCards: {
        ...prev.resourceCards,
        [resource]: value,
      },
    }));
  };

  const handleInitialPlayerResourceCardChange = (
    resource: string,
    value: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      initialPlayerResourceCards: {
        ...prev.initialPlayerResourceCards,
        [resource]: value,
      },
    }));
  };

  const createGame = async () => {
    setIsCreating(true);
    try {
      const room = await client.createRoom(RoomNames.Debug, {
        ...config,
        name: config.name.trim(),
      });

      if (config.debug && room) {
        room.send("startGame", { autoPlace: config.autoPlace });
      }

      // Navigate to game page with room ID
      if (room) {
        navigate(
          `/game/${room.id}?name=${encodeURIComponent(config.name.trim())}`
        );
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create game room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear config from localStorage:", error);
    }
    setConfig(defaultConfig);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper elevation={3} sx={{ pr: 6, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate("/")}
            disabled={isCreating}
          >
            ← Back to Lobby
          </Button>
          <Typography variant="h4" component="h1">
            Game Configuration
          </Typography>
          <Box sx={{ width: "120px" }} /> {/* Spacer for centering */}
        </Box>
        <Grid container spacing={3}>
          {/* Basic Settings */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Player Name"
                      value={config.name}
                      onChange={(e) =>
                        handleConfigChange("name", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Num Players"
                      type="number"
                      inputProps={{ min: 2, max: 4 }}
                      value={config.numPlayers}
                      onChange={(e) =>
                        handleConfigChange("numPlayers", Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Exchange Rate"
                      type="number"
                      inputProps={{ min: 2, max: 10 }}
                      value={config.defaultExchangeRate}
                      onChange={(e) =>
                        handleConfigChange(
                          "defaultExchangeRate",
                          Number(e.target.value)
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.autoPlace}
                          onChange={(e) =>
                            handleConfigChange("autoPlace", e.target.checked)
                          }
                        />
                      }
                      label="Auto Place Initial Structures"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Game Components */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Game Components per Player
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Settlements"
                      type="number"
                      inputProps={{ min: 1, max: 10 }}
                      value={config.numSettlements}
                      onChange={(e) =>
                        handleConfigChange(
                          "numSettlements",
                          Number(e.target.value)
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Cities"
                      type="number"
                      inputProps={{ min: 1, max: 10 }}
                      value={config.numCities}
                      onChange={(e) =>
                        handleConfigChange("numCities", Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Roads"
                      type="number"
                      inputProps={{ min: 1, max: 30 }}
                      value={config.numRoads}
                      onChange={(e) =>
                        handleConfigChange("numRoads", Number(e.target.value))
                      }
                    />
                  </Grid>

                  {Object.entries(config.initialPlayerResourceCards).map(
                    ([resource, count]) => (
                      <Grid item xs={12} sm={6} md={2} key={resource}>
                        <TextField
                          size="small"
                          type="number"
                          fullWidth
                          label={resource}
                          inputProps={{ min: 0, max: 20 }}
                          value={count}
                          onChange={(e) =>
                            handleInitialPlayerResourceCardChange(
                              resource,
                              Number(e.target.value)
                            )
                          }
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Resource Cards Bank */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bank Resource Cards
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(config.resourceCards).map(
                    ([resource, count]) => (
                      <Grid item xs={12} sm={6} md={2} key={resource}>
                        <TextField
                          size="small"
                          type="number"
                          fullWidth
                          label={resource}
                          inputProps={{ min: 0, max: 50 }}
                          value={count}
                          onChange={(e) =>
                            handleResourceCardChange(
                              resource,
                              Number(e.target.value)
                            )
                          }
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={resetToDefaults}
                disabled={isCreating}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={createGame}
                disabled={isCreating || !config.name.trim()}
                sx={{ minWidth: 150 }}
              >
                {isCreating ? "Creating Game..." : "Create Game"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default DebugPage;
