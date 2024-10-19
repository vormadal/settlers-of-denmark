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
          10, 10,
          -10, 10,
          -10, -10,
          -3, -10,
          -3, -3,
          3, -3,
          3, -10,
          10, -10,
          10, 10]
    
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
