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

  const xs = state?.LandTiles.map((x) => x.position.x).sort(
    (a, b) => a - b
  ) || [0];
  const ys = state?.LandTiles.map((x) => x.position.y).sort(
    (a, b) => a - b
  ) || [0];

  const buffer = 200;
  const xMin = xs.slice(0, 1)[0] - buffer;
  const xMax = xs.slice(-1)[0] + buffer;
  const yMin = ys.slice(0, 1)[0] - buffer;
  const yMax = ys.slice(-1)[0] + buffer;

  const [cx, cy] = [(xMin + xMax) / 2, (yMin + yMax) / 2];

  const width = xMax - xMin;
  const height = yMax - yMin;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // const scaleWidth = width / windowWidth;
  const scaleWidth = windowWidth / width;
  // const scaleHeight = height / windowHeight;
  const scaleHeight = windowHeight / height;
  let scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight;
  if (scale < 0.5) scale = 1;

  const offsetX = -window.innerWidth / 2 + cx*scale;
  const offsetY = -window.innerHeight / 2 + cy*scale;
  console.log("size", width, height);
  console.log("dimensions", windowWidth, windowHeight);
  console.log("scale", scale);
  console.log("center", cx, cy);
  console.log("offset", offsetX, offsetY);
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <Layer scale={{ x: scale, y: scale}}>
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
