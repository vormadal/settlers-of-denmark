import { Arc, Circle, Group, Line, Rect, Text } from "react-konva";
import { getCenter } from "../geometry/geometryUtils";
import { Point } from "../state/Point";
import { colors } from "../utils/colors";

interface Props {
  pointA: Point;
  pointB: Point;
  ratio: number;
  cardTypes: string[];
  hexCenter: Point;
}

// Calculate outward normal direction from edge
function getOutwardNormal(pointA: Point, pointB: Point, hexCenter: Point) {
  const center = getCenter([pointA, pointB]);

  // Direction is simply from hex center through edge center
  const dx = center.x - hexCenter.x;
  const dy = center.y - hexCenter.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  const nx = dx / length;
  const ny = dy / length;

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

// Harbor circle background component
function HarborCircle({ cardType }: { cardType: string }) {
  const radius = 25;

  if (cardType === "Any") {
    // Create sections for all resource types when it's an "Any" harbor
    const resourceTypes = ["Grain", "Wool", "Lumber", "Ore", "Brick"];
    const sectionAngle = 360 / resourceTypes.length;

    return (
      <Group>
        {/* Base circle */}
        <Circle
          x={0}
          y={0}
          radius={radius}
          fill="#ffffff"
          stroke="#333333"
          strokeWidth={1}
        />
        {/* Colored sections */}
        {resourceTypes.map((type, index) => (
          <Arc
            key={type}
            x={0}
            y={0}
            innerRadius={0}
            outerRadius={radius - 1}
            angle={sectionAngle}
            rotation={index * sectionAngle + 55}
            fill={colors[type] || "#cccccc"}
            stroke="#ffffff"
            strokeWidth={0.5}
          />
        ))}
      </Group>
    );
  } else {
    // Single color circle for specific resource types
    const color = colors[cardType] || "#cccccc";
    return (
      <Circle
        x={0}
        y={0}
        radius={radius}
        fill={color}
        stroke="#333333"
        strokeWidth={1}
      />
    );
  }
}

// Simple boat component
function Boat({
  x,
  y,
  cardType,
  children,
}: {
  x: number;
  y: number;
  cardType: string;
  children?: React.ReactNode;
}) {
  return (
    <Group x={x} y={y}>
      {/* Background circle with card type color */}
      <HarborCircle cardType={cardType} />
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
}: {
  x: number;
  y: number;
  ratio: number;
}) {
  const text = `${ratio}:1`;
  const width = Math.max(50, text.length * 6);

  return (
    <Group x={x} y={y} offsetX={width / 2}>

      <Text
        width={width}
        height={20}
        text={text}
        fontSize={16}
        fontVariant="bold"
        fill="#333"
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}

export function HarborShape({ pointA, pointB, cardTypes, ratio, hexCenter }: Props) {

  const { nx, ny, center } = getOutwardNormal(pointA, pointB, hexCenter);
  const boatX = center.x + nx * 40;
  const boatY = center.y + ny * 40;

  const cardType = cardTypes?.length > 1 ? "Any" : cardTypes[0] || "Any";
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
        start={pointA}
        directionX={leftDirX}
        directionY={leftDirY}
        length={pierLength}
        edgeCenter={center}
      />
      <Pier
        start={pointB}
        directionX={rightDirX}
        directionY={rightDirY}
        length={pierLength}
        edgeCenter={center}
      />

      {/* Boat */}
      <Boat x={boatX} y={boatY} cardType={cardType}>
        {/* Label */}
        <HarborLabel
          x={0}
          y={5}
          ratio={ratio}
        />
      </Boat>
    </Group>
  );
}
