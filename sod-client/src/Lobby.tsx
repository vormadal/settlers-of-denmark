import { useEffect, useState } from "react";
import { useColyseus } from "./ColyseusContext";
import { useGameState } from "./GameStateContext";
import { MyRoomState } from "./state/MyRoomState";
import { Room, RoomAvailable } from "colyseus.js";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

export function Lobby() {
  const client = useColyseus();
  const [state, setState] = useGameState();
  const [rooms, setRooms] = useState<RoomAvailable<MyRoomState>[]>([]);
  const [reconnectionToken, setReconnectionToken] = useState(
    sessionStorage.getItem("reconnectionToken")
  );

  useEffect(() => {
    client.getAvailableRooms<MyRoomState>().then((rooms) => {
      setRooms(rooms);
    });
  }, [setRooms, client]);
  //   useEffect(() => {
  //     client
  //       .joinOrCreate<MyRoomState>("my_room", { test: "hello" })
  //       .then((room) => {
  //         console.log(room.sessionId, "joined", room.name);

  //         room.onStateChange((state) => {
  //           setState(state);
  //           console.log(room.name, "has new state:", state);
  //         });

  //         room.onMessage("message_type", (message) => {
  //           console.log(room.sessionId, "received on", room.name, message);
  //         });

  //         room.onError((code, message) => {
  //           console.log(room.sessionId, "couldn't join", room.name);
  //         });

  //         room.onLeave((code) => {
  //           console.log(room.sessionId, "left", room.name);
  //         });
  //       })
  //       .catch((e) => {
  //         console.log("JOIN ERROR", e);
  //       });
  //   }, []);

  function attachStateListener(room: Room<MyRoomState>) {
    sessionStorage.setItem("reconnectionToken", room.reconnectionToken);
    room.onStateChange((state) => {
      setState(state);
    });
  }

  async function createRoom() {
    const room = await client.create<MyRoomState>("my_room");
    attachStateListener(room);
  }

  async function joinRoom(id: string) {
    const room = await client.joinById<MyRoomState>(id);
    attachStateListener(room);
  }

  async function handleReconnect() {
    if (!reconnectionToken) return;
    const room = await client.reconnect<MyRoomState>(reconnectionToken);
    attachStateListener(room);
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Lobby
        </Typography>
        {reconnectionToken && (
          <Button onClick={handleReconnect}>Reconnect</Button>
        )}
        <List>
          {!rooms.length && (
            <Typography variant="body1">No available rooms</Typography>
          )}
          {rooms.map((x) => (
            <ListItem
              key={x.roomId}
              secondaryAction={
                <Button aria-label="join" onClick={() => joinRoom(x.roomId)}>
                  Join
                </Button>
              }
            >
              <ListItemText primary={x.name} secondary={x.roomId} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={createRoom}>
          Create room
        </Button>
      </Box>
    </Container>
  );
}
