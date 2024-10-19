import { Line } from "react-konva";
import { Vector } from "ts-matrix";
import { BorderEdge } from "../state/BorderEdge";

interface Props {
  edge: BorderEdge;
  color: string;
}
export function RoadShape({ edge, color = "#000000" }: Props) {
  function GetRotation() {
    const list = [];

    list.push(edge.pointA.x - edge.pointB.x);
    list.push(edge.pointA.y - edge.pointB.y);

    return GetRotationFromVector(new Vector(list));
  }

  function GetRotationFromVector(vet: Vector) {
    let baseVector = new Vector([1, 0]);

    if (vet.at(1) < 0) {
      baseVector = new Vector([-1, 0]);
    }

    const test = vet.angleFrom(baseVector);
    const degrees = (test * 180) / Math.PI;
    return degrees;
  }

  function GetMiddlePoint(nr1: number, nr2: number) {
    const translationX = nr1 - nr2;
    return nr2 + translationX / 2;
  }

  function GetPoints() {
    const shapePoints = [
      0.25, 0.08, 0.08, 0.02, -0.08, 0.08, -0.25, 0.02, -0.25, -0.08, -0.08,
      -0.02, 0.08, -0.08, 0.25, -0.02,
    ];

    return shapePoints;
  }

  return (
    <Line
      points={GetPoints()}
      x={GetMiddlePoint(edge.pointA.x, edge.pointB.x)}
      y={GetMiddlePoint(edge.pointA.y, edge.pointB.y)}
      closed={true}
      strokeWidth={0.01}
      stroke={"#000000"}
      fill={color}
      tension={0.5}
      rotation={GetRotation()}
    />
  );
}
