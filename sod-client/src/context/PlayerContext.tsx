import { createContext, useContext, useEffect, useState } from "react";
import { Player } from "../state/Player";
import { useRoom } from "./RoomContext";
import { usePlayers } from "../hooks/stateHooks";

const PlayerContext = createContext<Player | undefined>(undefined);

export function usePlayer() {
  return useContext(PlayerContext);
}

interface Props {
  children: React.ReactElement;
  override?: Player;
}
export function PlayerContextProvider({ children, override }: Props) {
  const players = usePlayers();
  const room = useRoom();
  const [player, setPlayer] = useState<Player | undefined>(
    players.find((x) => x.id === room.sessionId)
  );

  useEffect(() => {
    const sessionPlayers = players.filter(
      (x) => x.sessionId === room.sessionId
    );
    const currentPlayer = players.find(
      (x) => x.id === room.state.currentPlayer
    );
    // should just be a single player with this session id.
    // but when debugging, all players have the same session id
    // this allows one player to play for all
    setPlayer(sessionPlayers.length > 1 ? currentPlayer : sessionPlayers[0]);
  }, [players, room.sessionId, room.state.currentPlayer]);

  return (
    <PlayerContext.Provider value={override || player}>
      {children}
    </PlayerContext.Provider>
  );
}
