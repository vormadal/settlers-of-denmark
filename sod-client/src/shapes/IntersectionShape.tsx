import { Circle, Line } from "react-konva";
import { Intersection } from "../state/Intersection";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useGameState } from "../GameStateContext";

interface Type {
  intersection: Intersection;
  show: boolean;
  onClick?: (intersection: Intersection) => void;
}

const inactiveColor = "#f0e68c";
const activeColor = "#fa8072";
export function IntersectionShape({ intersection, show, onClick }: Type) {
  const [_, room] = useGameState();
  const [focus, setFocus] = useState(false);
  function handleClick() {
    room?.send("PLACE_HOUSE", {
      intersectionId: intersection.id,
    });
    onClick && onClick(intersection);
  }

  function handleMouseEnter(event: KonvaEventObject<MouseEvent>) {
    setFocus(true);
  }

  function handleMouseLeave() {
    setFocus(false);
  }
  return (
    <Circle
      x={intersection.position.x}
      y={intersection.position.y}
      radius={9}
      fill={show ? activeColor : inactiveColor}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scaleX={focus ? 1.6 : 1}
      scaleY={focus ? 1.6 : 1}
    />
  );
}
