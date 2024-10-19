import { Layer, Stage, Text } from "react-konva";
import { Land } from "./shapes/LandShape";
import { EdgeShape } from "./shapes/EdgeShape";
import { IntersectionShape } from "./shapes/IntersectionShape";
import { MyRoomState } from "./state/MyRoomState";
import { useEffect, useState } from "react";

interface Props {
  state: MyRoomState;
}
export function BaseGame({ state }: Props) {
  const [gameState, setGameState] = useState(state.gameState);

  useEffect(() => {
    state.onChange(() => {
      // something changed on .state
      console.log("state changed...")
  });
    state.listen(
      "gameState",
      (value) => {
        setGameState(value);
      },
      true
    );
  }, [setGameState, state]);
  const xs = state?.LandTiles.map((x) => x.position.x).sort(
    (a, b) => a - b
  ) || [0];
  const ys = state?.LandTiles.map((x) => x.position.y).sort(
    (a, b) => a - b
  ) || [0];

  const buffer = 1;
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

  const offsetX = -window.innerWidth / 2 + cx * scale;
  const offsetY = -window.innerHeight / 2 + cy * scale;
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
      <Layer scale={{ x: scale, y: scale }}>
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
      <Layer>
        {gameState === "waiting_for_players" && (
          <Text x={100} y={100} fontSize={50} text="waiting for players..." />
        )}
      </Layer>
    </Stage>
  );
}
