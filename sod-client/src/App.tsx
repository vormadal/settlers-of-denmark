import { Layer, Stage, Star, Text, RegularPolygon } from "react-konva";
import "./App.css";
import { Land } from "./shapes/LandShape";
import * as Colyseus from "colyseus.js";
import { useEffect, useState } from "react";
import { MyRoomState } from "./state/MyRoomState";
import { EdgeShape } from "./shapes/EdgeShape";
import { IntersectionShape } from "./shapes/IntersectionShape";

// const tiles = [
//   "Dessert",
//   "Forrest",
//   "Mountains",
//   "Lifestock",
//   "Mine",
//   "Grain",
// ].map(
//   (x, i) =>
//     new LandTiles(`tile-${i}`, x, new Position(100 + i * 100, 100), [], [])
// );

const client = new Colyseus.Client("ws://localhost:2567");

function App() {
  const [state, setState] = useState<MyRoomState>();
  useEffect(() => {
    client
      .joinOrCreate<MyRoomState>("my_room")
      .then((room) => {
        console.log(room.sessionId, "joined", room.name);

        room.onStateChange((state) => {
          setState(state);
          console.log(room.name, "has new state:", state);
        });

        room.onMessage("message_type", (message) => {
          console.log(room.sessionId, "received on", room.name, message);
        });

        room.onError((code, message) => {
          console.log(room.sessionId, "couldn't join", room.name);
        });

        room.onLeave((code) => {
          console.log(room.sessionId, "left", room.name);
        });
      })
      .catch((e) => {
        console.log("JOIN ERROR", e);
      });
  }, []);
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {state?.LandTiles.map((x) => (
          <Land key={x.id} tile={x} />
        ))}

        {state?.edges.map((x) => (
          <EdgeShape key={x.id} edge={x} />
        ))}

        {state?.intersections.map((x) => (
          <IntersectionShape key={x.id} intersection={x} show />
        ))}
      </Layer>
    </Stage>
  );
}

export default App;
