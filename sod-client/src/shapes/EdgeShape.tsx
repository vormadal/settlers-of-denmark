import { Group } from "konva/lib/Group";
import { useRef, useState } from "react";
import Point from "../geometry/Point";
import { usePulseAnimation } from "../utils/konvaAnimations";
import { BaseRoadShape } from "./BaseRoadShape";

interface Props {
  pointA: Point;
  pointB: Point;
  show: boolean;
  onClick?: () => void;
}

export function EdgeShape({ pointA, pointB, show, onClick }: Readonly<Props>) {
  const [hover, setHover] = useState(false);
  const shapeRef = useRef<Group>(null);

  usePulseAnimation(shapeRef, {
    enabled: show && !hover,
    period: 2000,
    scaleAmplitude: 0.1,
    defaultScale: hover ? 1.2 : 1.0
  });

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  if (!show) return null;

  return (
    <BaseRoadShape
      ref={shapeRef}
      pointA={pointA}
      pointB={pointB}
      fillColor="#ffffff"
      borderColor="#000000"
      opacity={0.5}
      onClick={onClick}
      onTouchEnd={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scale={1}
    />
  );
}
