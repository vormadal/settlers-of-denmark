import { Layer, Stage, Star, Text, RegularPolygon } from "react-konva";
import "./App.css";
import { Land } from "./shapes/Land";
import { LandTiles } from "./models/LandTiles";
import { Position } from "./models/Position";

const tiles = [
  "Dessert",
  "Forrest",
  "Mountains",
  "Lifestock",
  "Mine",
  "Grain",
].map(
  (x, i) => new LandTiles(`tile-${i}`, x, new Position(100+ i * 100, 100), [], [])
);
function App() {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {tiles.map((x) => (
          <Land key={x.id} tile={x} />
        ))}
        {/* <Star
            key={star.id}
            id={star.id}
            x={star.x}
            y={star.y}
            numPoints={5}
            innerRadius={20}
            outerRadius={40}
            fill="#89b717"
            opacity={0.8}
            draggable
            rotation={star.rotation}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={star.isDragging ? 10 : 5}
            shadowOffsetY={star.isDragging ? 10 : 5}
            scaleX={star.isDragging ? 1.2 : 1}
            scaleY={star.isDragging ? 1.2 : 1}
          />
        ))} */}
      </Layer>
    </Stage>
  );
}

export default App;
