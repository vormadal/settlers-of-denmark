import React, { useState } from "react";
import { Stage, Layer } from "react-konva";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { RoadShape } from "../shapes/RoadShape";
import { EdgeShape } from "../shapes/EdgeShape";
import { ArraySchema } from "@colyseus/schema";

import { Land } from "../shapes/LandShape";
import NumberToken from "../shapes/NumberToken";
import { BorderEdge } from "../state/BorderEdge";
import { Hex } from "../state/Hex";
import { Intersection } from "../state/Intersection";
import { Point } from "../state/Point";
import { SettlementShape } from "../shapes/SettlementShape";
import { CityShape } from "../shapes/CityShape";
import { HarborShape } from "../shapes/HarborShape";
import { Harbor } from "../state/Harbor";
import { CardNames } from "../utils/CardNames";

const playerColors = [
  "#ff4444", // Red
  "#4444ff", // Blue
  "#44ff44", // Green
  "#ffff44", // Yellow
  "#ff44ff", // Magenta
  "#44ffff", // Cyan
];

const tileTypes = [
  "HILLS",
  "FOREST",
  "MOUNTAINS",
  "FIELDS",
  "PASTURE",
  "DESERT",
];
const createPoint = (x: number, y: number) => {
  const point = new Point();
  point.x = x;
  point.y = y;
  return point;
};
const hexPoints = [
  createPoint(50, -87),
  createPoint(-50, -87),
  createPoint(-100, 0),
  createPoint(-50, 87),
  createPoint(50, 87),
  createPoint(100, 0),
];

const getHexPoints = (point: Point) => {
  return hexPoints.map((hexPoint) => {
    return createPoint(hexPoint.x + point.x, hexPoint.y + point.y);
  });
};

const createHexRoads = (center: Point) => {
  const points = getHexPoints(center);
  const roads = [];
  for (let i = 0; i < points.length; i++) {
    const pointA = points[i];
    const pointB = points[(i + 1) % points.length];
    roads.push(createEdge(pointA, pointB));
  }
  return roads;
};

const createHex = (center: Point, type: string) => {
  const hex = new Hex();
  hex.id = "preview-hex";
  hex.type = type;
  hex.value = 8;
  hex.intersections = new ArraySchema<Intersection>();
  hex.intersections.push(...getHexPoints(center).map(createIntersection));
  return hex;
};

// Helper to create Intersection instances
const createIntersection = (point: Point) => {
  const intersection = new Intersection();
  intersection.position = point;
  intersection.id = `intersection-${point.x}-${point.y}`;
  return intersection;
};

const createEdge = (pointA: Point, pointB: Point) => {
  const edge = new BorderEdge();
  edge.pointA = pointA;
  edge.pointB = pointB;
  edge.id = `edge-${pointA.x}-${pointA.y}-to-${pointB.x}-${pointB.y}`;
  return edge;
};

// Helper to create Harbor instances
const createHarbor = (edge: BorderEdge, ratio: number, cardTypes: string[]) => {
  const harbor = new Harbor();
  harbor.edge = edge;
  harbor.ratio = ratio;
  harbor.id = `harbor-${edge.id}`;
  harbor.cardTypes = new ArraySchema<string>();
  harbor.cardTypes.push(...cardTypes);
  return harbor;
};

export function ComponentsPage() {
  const [selectedColor, setSelectedColor] = useState(playerColors[0]);
  const [selectedTileType, setSelectedTileType] = useState(tileTypes[0]);
  const [showEdges, setShowEdges] = useState(true);

  const center = createPoint(400, 300);
  const hex = createHex(center, selectedTileType);
  const intersections = [...hex.intersections];
  const roads = createHexRoads(center);


  // Create harbor examples on some edges
  const harbors = roads.slice(0, 1).map(
    (x) => createHarbor(x, 3, [CardNames.Lumber]) // Lumber harbor
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Component Showcase
      </Typography>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Controls
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Player Color</InputLabel>
              <Select
                value={selectedColor}
                label="Player Color"
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {playerColors.map((color, index) => (
                  <MenuItem key={color} value={color}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          border: "1px solid #ccc",
                        }}
                      />
                      Player {index + 1}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tile Type</InputLabel>
              <Select
                value={selectedTileType}
                label="Tile Type"
                onChange={(e) => setSelectedTileType(e.target.value)}
              >
                {tileTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Show Edge Shapes</InputLabel>
              <Select
                value={showEdges ? "yes" : "no"}
                label="Show Edge Shapes"
                onChange={(e) => setShowEdges(e.target.value === "yes")}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Canvas */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shape Preview
            </Typography>

            <Stage
              width={800}
              height={600}
              style={{ backgroundColor: "#2d77d2ff" }}
            >
              <Layer>
                {/* Hex with Roads - Game Board Scale */}
                <Land hex={hex} />

                {/* Harbors */}
                {harbors.map((harbor) => (
                  <HarborShape
                    key={harbor.id}
                    pointA={harbor.edge.pointA}
                    pointB={harbor.edge.pointB}
                    cardTypes={harbor.cardTypes.toArray()}
                    ratio={harbor.ratio}
                    hexCenter={center}
                  />
                ))}

                {/* Roads around the hex using exact game coordinates */}
                {roads.slice(0, 3).map((road) => (
                  <RoadShape key={road.id} color={selectedColor} pointA={road.pointA} pointB={road.pointB} />
                ))}

                {/* Edge shapes (placement indicators) around the hex */}
                {roads.slice(3).map((road) => (
                  <EdgeShape
                    key={`edge-${road.id}`}
                    pointA={road.pointA}
                    pointB={road.pointB}
                    show={showEdges}
                    onClick={() => console.log(`Edge clicked: ${road.id}`)}
                  />
                ))}

                <SettlementShape
                  color={selectedColor}
                  intersection={intersections[0]}
                  isUpgradable={true}
                />
                <CityShape
                  color={selectedColor}
                  position={intersections[1].position}
                />
              </Layer>
            </Stage>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
