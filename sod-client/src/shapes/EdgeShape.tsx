import { Line } from "react-konva";
import { BorderEdge } from "../state/BorderEdge";

interface Props {
  edge: BorderEdge;
}
export function EdgeShape({ edge }: Props) {
  return (
    <Line
      points={[edge.pointA.x, edge.pointA.y, edge.pointB.x, edge.pointB.y]}
      fill={"#ff0000"}
      width={2}
    />
  );
}
