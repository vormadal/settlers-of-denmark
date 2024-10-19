import { Layer, Stage, Text } from "react-konva";
import { Land } from "./shapes/LandShape";
import { EdgeShape } from "./shapes/EdgeShape";
import { IntersectionShape } from "./shapes/IntersectionShape";
import { GameState } from "./state/GameState";
import { useEffect, useState } from "react";
import { HouseShape } from "./shapes/HouseShape";
import { Player } from "./state/Player";
import { Room } from "colyseus.js";
import { RoadShape } from "./shapes/RoadShape";

interface Props {
  room: Room<GameState>;
}

const colors = ["#ff0000", "#00ff00", "#0000ff", "#f0000f"];
export function BaseGame({ room }: Props) {
  const [state, setState] = useState(room.state);
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    setState(room.state);
    room.onStateChange((state) => {
      setPlayers([...state.players.values()]);
    });
    // room.state.listen(
    //   "gameState",
    //   (value) => {
    //     setGameState(value);
    //   },
    //   true
    // );
  }, [setState, room]);
  const xs = state?.landTiles
    .map((x) => x.position.x)
    .sort((a, b) => a - b) || [0];
  const ys = state?.landTiles
    .map((x) => x.position.y)
    .sort((a, b) => a - b) || [0];

  const buffer = 100;
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

  const houses = players
    .map((player, i) =>
      player.houses
        .filter((x) => !!x.intersection)
        .map((house) => ({ player, house, color: colors[i] }))
    )
    .flat();

  const roads = players
    .map((player, i) =>
      player.roads
        .filter((x) => !!x.edge)
        .map((road) => ({ player, road, color: colors[i] }))
    )
    .flat();

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      offsetX={offsetX}
      offsetY={offsetY}
    >
      <Layer scale={{ x: scale, y: scale }}>
        {state?.landTiles.map((x) => (
          <Land key={x.id} tile={x} />
        ))}

        {state?.edges.map((x) => (
          <EdgeShape key={x.id} edge={x} />
        ))}

        {state?.intersections.map((x) => (
          <IntersectionShape key={x.id} intersection={x} show />
        ))}

        {houses.map(({ house, player, color }) => (
          <HouseShape
            key={house.id}
            color={color}
            intersection={
              state.intersections.find((x) => x.id === house.intersection)!
            }
          />
        ))}

        {houses.map(({ house, player, color }) => (
          <HouseShape
            key={house.id}
            color={color}
            intersection={
              state.intersections.find((x) => x.id === house.intersection)!
            }
          />
        ))}

        {roads.map(({ road, player, color }) => (
          <RoadShape
            key={road.id}
            color={color}
            edge={state.edges.find((x) => x.id === road.edge)!}
          />
        ))}
      </Layer>
      <Layer>
        <Text fontSize={15} text={state.gameState} x={-250} y={0} />
        <Text
          fontSize={15}
          text={`CurrentPlayer: ${state.currentPlayer}`}
          x={-250}
          y={20}
        />
        <Text fontSize={15} text={`ME: ${room.sessionId}`} x={-250} y={40} />

        {state.gameState === "waiting_for_players" && (
          <Text x={100} y={100} fontSize={50} text="waiting for players..." />
        )}
      </Layer>
    </Stage>
  );
}
