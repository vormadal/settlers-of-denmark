import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useColyseus } from "../context/ColyseusContext";
import { RoomNames } from "../utils/RoomNames";
import { useNavigate } from "react-router-dom";

interface AlgorithmConfiguration {
  mapSize: number;
  numRoads: number;
  name: string;
}

const STORAGE_KEY = "debug-algorithm-page-config";

const defaultConfig: AlgorithmConfiguration = {
  mapSize: 3,
  numRoads: 15,
  name: "Algorithm Tester",
};

function DebugAlgorithmPage() {
  const client = useColyseus();
  const navigate = useNavigate();

  // Helper functions for localStorage
  const loadConfigFromStorage = (): AlgorithmConfiguration => {
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

  const saveConfigToStorage = (config: AlgorithmConfiguration) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn("Failed to save config to localStorage:", error);
    }
  };

  const [config, setConfig] = useState<AlgorithmConfiguration>(
    loadConfigFromStorage
  );
  const [isCreating, setIsCreating] = useState(false);

  // Save to localStorage whenever config changes
  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  const handleConfigChange = (field: keyof AlgorithmConfiguration, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const room = await client.createRoom(RoomNames.DebugAlgorithm, {
        ...config,
        name: config.name.trim(),
      });

      // Navigate to game page with room ID
      if (room) {
        navigate(
          `/game/${room.id}?name=${encodeURIComponent(config.name.trim())}`
        );
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create algorithm test room. Please try again.");
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
            Algorithm Test Configuration
          </Typography>
          <Box sx={{ width: "120px" }} /> {/* Spacer for centering */}
        </Box>
        <Grid container spacing={3}>
          {/* Basic Settings */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Algorithm Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This room is for testing map generation algorithms. Configure the map size (radius) and number of roads to test different layouts.
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Map Size (Radius)"
                      type="number"
                      inputProps={{ min: 1, max: 10 }}
                      value={config.mapSize}
                      helperText="Radius of the hexagonal map (3 = standard Catan size)"
                      onChange={(e) =>
                        handleConfigChange("mapSize", Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Number of Roads"
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      value={config.numRoads}
                      helperText="Number of random roads to place for testing"
                      onChange={(e) =>
                        handleConfigChange("numRoads", Number(e.target.value))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
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
                onClick={createRoom}
                disabled={isCreating || !config.name.trim()}
                sx={{ minWidth: 150 }}
              >
                {isCreating ? "Creating Room..." : "Create Algorithm Test Room"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default DebugAlgorithmPage;
