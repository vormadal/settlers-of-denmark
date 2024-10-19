import { Line } from "react-konva";
import { BorderEdge } from "../state/BorderEdge";

interface Props {
  edge: BorderEdge;
}
export function EdgeShape({ edge }: Props) {
  return (
    <Line
      points={[edge.pointA.x, edge.pointA.y, edge.pointB.x, edge.pointB.y]}
      strokeWidth={0.05}
      stroke={"#ff0000"}
    />
  );
}
