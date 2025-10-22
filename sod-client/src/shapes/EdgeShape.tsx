import { useRef, useState } from "react";
import { BaseRoadShape } from "./BaseRoadShape";
import { BorderEdge } from "../state/BorderEdge";
import { Group } from "konva/lib/Group";
import { usePulseAnimation } from "../utils/konvaAnimations";

interface Props {
  edge: BorderEdge;
  show: boolean;
  onClick?: () => void;
}

export function EdgeShape({ edge, show, onClick }: Props) {
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
      edge={edge}
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
