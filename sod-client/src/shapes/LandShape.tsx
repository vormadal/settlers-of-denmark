import { RegularPolygon } from "react-konva";
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
    <RegularPolygon
      radius={60}
      sides={6}
      rotation={90}
      x={tile.position.x}
      y={tile.position.y}
      fill={colors[tile.type] ?? "#ff0000"}
    />
  );
}
