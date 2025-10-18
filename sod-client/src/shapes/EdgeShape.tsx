import { useState } from "react";
import { BaseRoadShape } from "./BaseRoadShape";
import { BorderEdge } from "../state/BorderEdge";

interface Props {
  edge: BorderEdge;
  show: boolean;
  onClick?: () => void;
}

export function EdgeShape({ edge, show, onClick }: Props) {
  const [hover, setHover] = useState(false);

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  if (!show) return null;

  return (
    <BaseRoadShape 
      edge={edge}
      fillColor="#ffffff"
      borderColor="#000000"
      opacity={0.6}
      onClick={onClick}
      onTouchEnd={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      scale={hover ? 1.2 : 1}
    />
  );
}
