import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../hooks/stateHooks";
import { useRoom } from "../context/RoomContext";

interface WaitingSplashScreenProps {
  maxPlayers: number;
}

export function WaitingSplashScreen({ maxPlayers }: WaitingSplashScreenProps) {
  const players = usePlayers();
  const room = useRoom();
  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  function leaveRoom() {
    try {
      room?.leave(true);
    } catch (e) {
      console.warn("Failed to leave room:", e);
    }
    navigate("/", { replace: true });
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-700">
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Settlers of Denmark</h1>
          <p className="text-xl mb-2">
            Waiting for players{dots}
          </p>
          <p className="text-lg opacity-80">
            {players.length} / {maxPlayers} players joined
          </p>
        </div>

        {/* Player list */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Players</h3>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="font-medium">{player.name}</span>
                </div>
              ))}
              {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center justify-center space-x-2 opacity-50">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <span>Waiting...</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={leaveRoom}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
