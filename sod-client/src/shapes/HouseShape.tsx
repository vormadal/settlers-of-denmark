import { Line, Circle, Ellipse } from "react-konva";
import { BorderEdge } from "../state/BorderEdge";
import { Vector } from "ts-matrix";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Intersection } from "../state/Intersection";


interface Props {
    intersection: Intersection;
    color: string;
}
export function HouseShape({ intersection, color = "#00ff00" }: Props) {

    function GetPoints() {
        const shapePoints = [
          10, 10,
          -10, 10,
          -10, -5,
          0, -15,
          10, -5]
    
        return shapePoints
      }
    
      return (
        <Line
          points={GetPoints()}
          x={intersection.position.x}
          y={intersection.position.y}
          closed={true}
          shadowEnabled={true}
          shadowColor="#000000"
          shadowOffsetX={2}
          shadowBlur={5}
          shadowOpacity={0.6}
          strokeWidth={1.1}
          stroke={"#000000"}
          fill={color}
        />
    
      );
}
