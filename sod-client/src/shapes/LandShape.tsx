import { Circle, RegularPolygon, Text } from "react-konva";
import { LandTiles } from "../state/LandTiles";

interface Type {
  tile: LandTiles;
}

const colors: { [key: string]: string } = {
  Dessert: "#d9bf65",
  Forrest: "#008000",
  Mountains: "#708090",
  Lifestock: "#adff2f",
  Mine: "#d2691e",
  Grain: "#ffdf00",
};

export function Land({ tile }: Type) {
  

  return (
    <div>
      <RegularPolygon
      radius={tile.radius-2}
      sides={6}
      rotation={90}
      x={tile.position.x}
      y={tile.position.y}
      fill={colors[tile.type] ?? "#ff0000"}
    />
    
      <Text
        text="5"
        fontSize={0.2}
        align="center"
        verticalAlign="bottom"
        offsetX={0.07}
        offsetY={0.1}
        x={tile.position.x}
        y={tile.position.y}
      />
      <Circle
      radius={0.2}
      stroke={"#000000"}
      strokeWidth={0.02}
        x={tile.position.x}
        y={tile.position.y}
      />

    </div>


  );

}
