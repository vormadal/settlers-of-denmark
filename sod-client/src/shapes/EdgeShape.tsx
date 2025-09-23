import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Ellipse } from "react-konva";
import { BorderEdge } from "../state/BorderEdge";
import { Point } from "../state/Point";
import { getLineRotation } from "../utils/VectorMath";
import { useRoom } from "../context/RoomContext";
import { useAvailableEdges, useCurrentPlayer, usePhase } from "../hooks/stateHooks";
import { usePlayer } from "../context/PlayerContext";

interface Props {
  edge: BorderEdge;
}

function getCenter(pointA: Point, pointB: Point) {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  };
}

export function EdgeShape({ edge }: Props) {
  const room = useRoom();
  const player = usePlayer();
  const currentPlayer = useCurrentPlayer();
  const phase = usePhase();
  const [focus, setFocus] = useState(false);
  const availableEdges = useAvailableEdges();
  
  const isRoadBuildingActive = phase.key === 'placingRoadBuilding';

  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true);
  }

  function handleMouseLeave() {
    setFocus(false);
  }

  function handleClick() {
    room?.send("PLACE_ROAD", {
      edgeId: edge.id,
    });
  }

  const center = getCenter(edge.pointA, edge.pointB);
  const rotation = getLineRotation(edge.pointA, edge.pointB);

  if (!availableEdges.includes(edge.id) || player?.id !== currentPlayer?.id)
    return null;

  // Subtle enhancements for Road Building phase
  const roadBuildingColor = isRoadBuildingActive ? "#8B4513" : "#ffffff";
  const roadBuildingOpacity = isRoadBuildingActive ? 0.8 : 0.6;
  const roadBuildingStroke = isRoadBuildingActive ? "#ffffff" : "#000000";
  const roadBuildingStrokeWidth = isRoadBuildingActive ? 1.2 : 0.9;

  return (
    <Ellipse
      x={center.x}
      y={center.y}
      onClick={handleClick}
      onTouchEnd={handleClick}
      radiusX={11}
      radiusY={6}
      rotation={rotation}
      fill={roadBuildingColor}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scaleX={focus ? 1.6 : 1}
      scaleY={focus ? 1.6 : 1}
      opacity={roadBuildingOpacity}
      shadowEnabled={true}
      shadowColor="#000000"
      shadowOffsetX={1}
      shadowBlur={2}
      shadowOpacity={0.3}
      strokeWidth={roadBuildingStrokeWidth}
      stroke={roadBuildingStroke}
    />
  );
}
