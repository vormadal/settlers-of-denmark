import { Circle, Group, RegularPolygon, Text } from "react-konva";
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
    <Group>
      <RegularPolygon
        radius={tile.radius - 2}
        sides={6}
        rotation={90}
        x={tile.position.x}
        y={tile.position.y}
        stroke={"#000000"}
        strokeWidth={0.015}
        fill={colors[tile.type] ?? "#ff0000"}
      />

      <Circle
        radius={0.2}
        fill={"#ffffff"}
        x={tile.position.x}
        y={tile.position.y}
        opacity={0.6}
      />
      <Circle
        radius={0.2}
        stroke={"#000000"}
        strokeWidth={0.02}
        x={tile.position.x}
        y={tile.position.y}
      />

      <Text
        text="5"
        fontSize={0.18}
        align="center"
        verticalAlign="middle"
        width={100}
        height={100}
        x={tile.position.x - 100/2}
        y={tile.position.y - 100/2}
        // scale={{ x: 0.01, y: 0.01 }}
        // offsetX={10}
        // offsetY={7}
      />
      


    </Group>


  );

}
