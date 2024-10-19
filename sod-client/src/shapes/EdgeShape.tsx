import { Line, Circle, Ellipse } from "react-konva";
import { BorderEdge } from "../state/BorderEdge";
import { Vector } from "ts-matrix";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  edge: BorderEdge;
}
export function EdgeShape({ edge }: Props) {

  function GetRotation() {
    const list = []
    
    list.push(edge.pointA.x - edge.pointB.x)
    list.push(edge.pointA.y - edge.pointB.y)

    return GetRotationFromVector(new Vector(list))
  }

  function GetRotationFromVector(vet: Vector) {

    let baseVector = new Vector([1,0])

    if(vet.at(1) < 0){
      baseVector = new Vector([-1,0])
    }

    const test = vet.angleFrom(baseVector)
    const degrees = test * 180 / Math.PI
    return degrees
  }

  function GetMiddlePoint(nr1: number, nr2: number) {
    const translationX = nr1 - nr2
    return nr2 + translationX / 2
  }

  const [focus, setFocus] = useState(false);
  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true);
  }

  function handleMouseLeave() {
    setFocus(false);
  }
  
  return (
    <Ellipse
      x={GetMiddlePoint(edge.pointA.x, edge.pointB.x)}
      y={GetMiddlePoint(edge.pointA.y, edge.pointB.y)}
      radiusX={11}
      radiusY={6}
      rotation={GetRotation()}
      fill={"#ffffff"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scaleX={focus ? 1.6 : 1}
      scaleY={focus ? 1.6 : 1}
      opacity={0.6}
      shadowEnabled={true}
      shadowColor="#000000"
      shadowOffsetX={1}
      shadowBlur={2}
      shadowOpacity={0.3}
      strokeWidth={0.9}
      stroke={"#000000"}
    />

  );

}
