import { Line, Circle, Ellipse } from "react-konva";
import { BorderEdge } from "../state/BorderEdge";
import { Vector } from "ts-matrix";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
    edge: BorderEdge;
    color: string;
}
export function RoadShape({ edge, color = "#000000" }: Props) {

    function GetRotation() {
        const list = []

        list.push(edge.pointA.x - edge.pointB.x)
        list.push(edge.pointA.y - edge.pointB.y)

        return GetRotationFromVector(new Vector(list))
    }

    function GetRotationFromVector(vet: Vector) {

        let baseVector = new Vector([1, 0])

        if (vet.at(1) < 0) {
            baseVector = new Vector([-1, 0])
        }

        const test = vet.angleFrom(baseVector)
        const degrees = test * 180 / Math.PI
        return degrees
    }

    function GetMiddlePoint(nr1: number, nr2: number) {
        const translationX = nr1 - nr2
        return nr2 + translationX / 2
    }

    function GetPoints() {
        const shapePoints = [
            25, 8,
            8, 2,
            -8, 8,
            -25, 2,
            -25, -8,
            -8, -2,
            8, -8,
            25, -2]

        return shapePoints
    }

    return (
        <Line
            points={GetPoints()}
            x={GetMiddlePoint(edge.pointA.x, edge.pointB.x)}
            y={GetMiddlePoint(edge.pointA.y, edge.pointB.y)}
            closed={true}
            strokeWidth={1}
            stroke={"#000000"}
            fill={"color"}
            tension={0.5}
            rotation={GetRotation()}

        />

    );
}
