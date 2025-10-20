import { Group, Line, Rect, Text } from "react-konva";
import { getCenter } from "../geometry/geometryUtils";
import { Harbor } from "../state/Harbor";
import { Point } from "../state/Point";

interface Props {
  harbor: Harbor;
  hexCenter: Point;
}

// Calculate outward normal direction from edge
function getOutwardNormal(edge: any, hexCenter: Point) {
  const center = getCenter([edge.pointA, edge.pointB]);

  const dx = edge.pointB.x - edge.pointA.x;
  const dy = edge.pointB.y - edge.pointA.y;

  let nx = -dy / Math.sqrt(dx * dx + dy * dy);
  let ny = dx / Math.sqrt(dx * dx + dy * dy);

  // Ensure normal points away from hex if hex center is provided
  if (hexCenter) {
    const hexToCenterX = center.x - hexCenter.x;
    const hexToCenterY = center.y - hexCenter.y;
    const dot = nx * hexToCenterX + ny * hexToCenterY;
    if (dot < 0) {
      nx = -nx;
      ny = -ny;
    }
  }

  return { nx, ny, center };
}

// Simple pier component with offset toward edge center
function Pier({
  start,
  directionX,
  directionY,
  length,
  edgeCenter,
}: {
  start: Point;
  directionX: number;
  directionY: number;
  length: number;
  edgeCenter: Pick<Point, "x" | "y">;
}) {
  // Calculate offset toward edge center to avoid overlap with neighboring harbors
  const offsetFactor = 0.1; // Move 10% toward edge center
  const offsetX = start.x + (edgeCenter.x - start.x) * offsetFactor;
  const offsetY = start.y + (edgeCenter.y - start.y) * offsetFactor;

  const midX = offsetX + (directionX * length) / 2;
  const midY = offsetY + (directionY * length) / 2;
  const angle = (Math.atan2(directionY, directionX) * 180) / Math.PI;

  return (
    <Group x={midX} y={midY} rotation={angle}>
      <Rect
        x={-length / 2}
        y={-3}
        width={length}
        height={10}
        fill="#a98274"
        stroke="#6d4c41"
        strokeWidth={0.7}
        cornerRadius={2}
      />
    </Group>
  );
}

// Simple boat component
function Boat({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children?: React.ReactNode;
}) {
  return (
    <Group x={x} y={y}>
      {/* Hull */}
      <Line
        points={[-14, -6, -10, 2, 0, 6, 10, 2, 14, -6]}
        closed
        fill="#5d4037"
        stroke="#3e2723"
        strokeWidth={1}
      />
      {/* Mast */}
      <Rect x={-1} y={-18} width={2} height={18} fill="#3e2723" />
      {/* Sail */}
      <Line
        points={[0, -18, 12, -8, 0, -8]}
        closed
        fill="#eeeeee"
        stroke="#bdbdbd"
        strokeWidth={0.8}
      />
      {children}
    </Group>
  );
}

// Simple label component
function HarborLabel({
  x,
  y,
  ratio,
  cardType,
}: {
  x: number;
  y: number;
  ratio: number;
  cardType: string;
}) {
  const text = `${ratio}:1 ${cardType}`;
  const width = Math.max(50, text.length * 6);

  return (
    <Group x={x} y={y} offsetX={width / 2}>
      <Rect
        width={width}
        height={20}
        fill="rgba(255,255,255,0.9)"
        stroke="#333"
        strokeWidth={0.5}
        cornerRadius={3}
      />
      <Text
        width={width}
        height={20}
        text={text}
        fontSize={10}
        fill="#333"
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}

export function HarborShape({ harbor, hexCenter }: Props) {
  const edge = harbor.edge;
  if (!edge?.pointA || !edge?.pointB) return null;



  const { nx, ny, center } = getOutwardNormal(edge, hexCenter);
  const boatX = center.x + nx * 40;
  const boatY = center.y + ny * 40;

  const cardType =
    harbor.cardTypes?.length > 1 ? "Any" : harbor.cardTypes[0] || "Any";
  const pierLength = 30;

  // Calculate slightly angled directions for piers to point toward each other
  const rotationAngle = 20; // degrees
  const rotationRad = (rotationAngle * Math.PI) / 180;

  // Left pier (from pointA) rotates clockwise toward center
  const leftCos = Math.cos(-rotationRad);
  const leftSin = Math.sin(-rotationRad);
  const leftDirX = nx * leftCos - ny * leftSin;
  const leftDirY = nx * leftSin + ny * leftCos;

  // Right pier (from pointB) rotates counter-clockwise toward center
  const rightCos = Math.cos(rotationRad);
  const rightSin = Math.sin(rotationRad);
  const rightDirX = nx * rightCos - ny * rightSin;
  const rightDirY = nx * rightSin + ny * rightCos;

  return (
    <Group listening={false}>
      {/* Piers from each endpoint angled toward each other */}
      <Pier
        start={edge.pointA}
        directionX={leftDirX}
        directionY={leftDirY}
        length={pierLength}
        edgeCenter={center}
      />
      <Pier
        start={edge.pointB}
        directionX={rightDirX}
        directionY={rightDirY}
        length={pierLength}
        edgeCenter={center}
      />

      {/* Boat */}
      <Boat x={boatX} y={boatY}>
        {/* Label */}
        <HarborLabel
          x={0}
          y={7}
          ratio={harbor.ratio}
          cardType={cardType}
        />
      </Boat>
    </Group>
  );
}
