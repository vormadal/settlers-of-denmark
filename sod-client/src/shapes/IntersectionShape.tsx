import { Circle } from "react-konva";
import { Intersection } from "../state/Intersection";

interface Type {
  intersection: Intersection;
  show: boolean;
}

const inactiveColor = "#f0e68c";
const activeColor = "#fa8072";
export function IntersectionShape({ intersection, show }: Type) {
  return (
    <Circle
      x={intersection.position.x}
      y={intersection.position.y}
      radius={5}
      fill={show ? activeColor : inactiveColor}
    />
  );
}
