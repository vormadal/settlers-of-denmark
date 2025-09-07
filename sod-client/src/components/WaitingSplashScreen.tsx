import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Fade,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../hooks/stateHooks";
import { useRoom } from "../context/RoomContext";

interface WaitingSplashScreenProps {
  maxPlayers: number;
}
// Settlers hex colors from the game
const hexColors = [
  "#008000", // Forest
  "#708090", // Mountains
  "#adff2f", // Pastures
  "#d2691e", // Hills
  "#ffdf00", // Fields
  "#d9bf65", // Desert
];
export function WaitingSplashScreen({ maxPlayers }: WaitingSplashScreenProps) {
  const players = usePlayers();
  const room = useRoom();
  const navigate = useNavigate();
  const [dots, setDots] = useState("");
  const [spinnerColor, setSpinnerColor] = useState(
    hexColors[players.length % hexColors.length]
  );
  const [floatingShapes, setFloatingShapes] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
      size: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const colorInterval = setInterval(() => {
      // Change spinner color every 10 seconds
      setSpinnerColor(hexColors[Math.floor(Math.random() * hexColors.length)]);
    }, 3000);

    const shapes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: Math.random() * 6 + 4,
      size: 20 + Math.random() * 40,
      color: hexColors[Math.floor(Math.random() * hexColors.length)],
    }));
    setFloatingShapes(shapes);
    return () => {
      clearInterval(interval);
      clearInterval(colorInterval);
    };
  }, []);

  const handleLeave = () => {
    room?.leave();
    navigate("/");
  };

  return (
    <Box
      width="100%"
      height="100vh"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating Hexagonal Shapes */}
      {floatingShapes.map((shape) => (
        <Box
          key={shape.id}
          sx={{
            position: "absolute",
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: 0.25,
            background: shape.color,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            "@keyframes float": {
              "0%": {
                transform: "translateY(0px) rotate(0deg)",
                opacity: 0.15,
              },
              "50%": {
                transform: "translateY(-20px) rotate(180deg)",
                opacity: 0.35,
              },
              "100%": {
                transform: "translateY(0px) rotate(360deg)",
                opacity: 0.15,
              },
            },
            animation: `float ${shape.duration}s ease-in-out infinite`,
            animationDelay: `${shape.delay}s`,
          }}
        />
      ))}

      <Fade in timeout={1000}>
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            textAlign: "center",
            minWidth: 300,
            maxWidth: 500,
            margin: 2,
          }}
        >
          {/* Game Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: 2,
              "@keyframes titlePulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.02)" },
              },
              animation: "titlePulse 3s ease-in-out infinite",
            }}
          >
            Settlers of Denmark
          </Typography>

          {/* Loading Hexagon Spinner */}
          <Box sx={{ marginY: 3, position: "relative" }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                margin: "0 auto",
                backgroundColor: spinnerColor,
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                // transition color
                transition: "background-color 0.5s ease",
                "@keyframes hexSpin": {
                  "0%": { transform: "rotate(0deg) scale(1)" },
                  "50%": { transform: "rotate(180deg) scale(1.1)" },
                  "100%": { transform: "rotate(360deg) scale(1)" },
                },
                animation: "hexSpin 10s linear infinite",
              }}
            />
          </Box>

          {/* Status Message */}
          <Typography
            variant="h5"
            sx={{
              marginBottom: 1,
              color: "#333",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            Waiting for players
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "24px",
                textAlign: "left",
              }}
            >
              {dots}
            </Box>
          </Typography>

          {/* Sub Message */}
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              marginBottom: 3,
            }}
          >
            {players.length} of {maxPlayers} players joined
          </Typography>

          {/* Player List */}
          {players.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 1, color: "#333" }}>
                Players Joined:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                {players.map((player, index) => (
                  <Fade key={player.id} in timeout={500 + index * 200}>
                    <Box
                      sx={{
                        padding: 1.5,
                        background:
                          "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                        borderRadius: 2,
                        border: "2px solid rgba(102, 126, 234, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        "@keyframes playerPulse": {
                          "0%, 100%": {
                            borderColor: "rgba(102, 126, 234, 0.2)",
                          },
                          "50%": { borderColor: "rgba(102, 126, 234, 0.5)" },
                        },
                        animation: "playerPulse 2s ease-in-out infinite",
                        animationDelay: `${index * 0.3}s`,
                      }}
                    >
                      <Box sx={{ fontSize: "1.5rem" }}>👤</Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          fontWeight: 500,
                        }}
                      >
                        {player.name || `Player ${index + 1}`}
                      </Typography>
                    </Box>
                  </Fade>
                ))}

                {/* Empty slots for missing players */}
                {Array.from({ length: maxPlayers - players.length }, (_, i) => (
                  <Box
                    key={`empty-${i}`}
                    sx={{
                      padding: 1.5,
                      background: "rgba(0, 0, 0, 0.05)",
                      borderRadius: 2,
                      border: "2px dashed rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      opacity: 0.5,
                    }}
                  >
                    <Box sx={{ fontSize: "1.5rem" }}>⏳</Box>
                    <Typography variant="body2" sx={{ color: "#999" }}>
                      Waiting...
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Leave Button */}
          <Box
            sx={{
              marginTop: 3,
              paddingTop: 2,
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleLeave}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                paddingX: 3,
                paddingY: 1,
                fontWeight: 500,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
                },
              }}
            >
              Leave Game
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
