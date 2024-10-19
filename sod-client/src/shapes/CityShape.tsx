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
export function CityShape({ intersection, color = "#000000" }: Props) {
    function GetPoints() {
        const shapePoints = [
          0.1, 0.1,
          -0.1, 0.1,
          -0.1, -0.1,
          -0.03, -0.1,
          -0.03, -0.03,
          0.03, -0.03,
          0.03, -0.1,
          0.1, -0.1,
          0.1, 0.1]
    
        return shapePoints
      }
    
      return (
        <Line
          points={GetPoints()}
          x={intersection.position.x}
          y={intersection.position.y}
          closed={true}
          strokeWidth={0.01}
          stroke={"#000000"}
          fill={"#00ff00"}
    
        />
    
      );
}