import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import { Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { RoadShape } from '../shapes/RoadShape'
import { ArraySchema } from '@colyseus/schema'

import { Land } from '../shapes/LandShape'
import NumberToken from '../shapes/NumberToken'
import { BorderEdge } from '../state/BorderEdge'
import { Hex } from '../state/Hex'
import { Intersection } from '../state/Intersection'
import { Point } from '../state/Point'
import { SettlementShape } from '../shapes/SettlementShape'
import { CityShape } from '../shapes/CityShape'

const playerColors = [
  '#ff4444', // Red
  '#4444ff', // Blue
  '#44ff44', // Green
  '#ffff44', // Yellow
  '#ff44ff', // Magenta
  '#44ffff' // Cyan
]

const tileTypes = ['HILLS', 'FOREST', 'MOUNTAINS', 'FIELDS', 'PASTURE', 'DESERT']
const createPoint = (x: number, y: number) => {
  const point = new Point()
  point.x = x
  point.y = y
  return point
}
const hexPoints = [
  createPoint(100, 0),
  createPoint(50, 87),
  createPoint(-50, 87),
  createPoint(-100, 0),
  createPoint(-50, -87),
  createPoint(50, -87)
]

const getHexPoints = (point: Point) => {
  return hexPoints.map((hexPoint) => {
    return createPoint(hexPoint.x + point.x, hexPoint.y + point.y)
  })
}

const createHexRoads = (center: Point) => {
  const points = getHexPoints(center)
  const roads = []
  for (let i = 0; i < points.length; i++) {
    const pointA = points[i]
    const pointB = points[(i + 1) % points.length]
    roads.push(createEdge(pointA, pointB))
  }
  return roads
}

const createHex = (center: Point, type: string) => {
  const hex = new Hex()
  hex.id = 'preview-hex'
  hex.type = type
  hex.value = 8
  hex.position = center
  hex.radius = 100 // Arbitrary for preview
  return hex
}

// Helper to create Intersection instances
const createIntersection = (point: Point) => {
  const intersection = new Intersection()
  intersection.position = point
  intersection.id = `intersection-${point.x}-${point.y}`
  return intersection
}

const createEdge = (pointA: Point, pointB: Point) => {
  const edge = new BorderEdge()
  edge.pointA = pointA
  edge.pointB = pointB
  edge.id = `edge-${pointA.x}-${pointA.y}-to-${pointB.x}-${pointB.y}`
  return edge
}

export function ComponentsPage() {
  const [selectedColor, setSelectedColor] = useState(playerColors[0])
  const [selectedTileType, setSelectedTileType] = useState(tileTypes[0])

  const center = createPoint(400, 300)
  const hexPoints = getHexPoints(center)
  const hex = createHex(center, selectedTileType)
  const roads = createHexRoads(center)
  const intersections = hexPoints.map(createIntersection)

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        Component Showcase
      </Typography>

      <Grid
        container
        spacing={3}
      >
        {/* Controls */}
        <Grid
          item
          xs={12}
          md={3}
        >
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Controls
            </Typography>

            <FormControl
              fullWidth
              sx={{ mb: 2 }}
            >
              <InputLabel>Player Color</InputLabel>
              <Select
                value={selectedColor}
                label="Player Color"
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {playerColors.map((color, index) => (
                  <MenuItem
                    key={color}
                    value={color}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          border: '1px solid #ccc'
                        }}
                      />
                      Player {index + 1}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{ mb: 2 }}
            >
              <InputLabel>Tile Type</InputLabel>
              <Select
                value={selectedTileType}
                label="Tile Type"
                onChange={(e) => setSelectedTileType(e.target.value)}
              >
                {tileTypes.map((type) => (
                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type.toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Canvas */}
        <Grid
          item
          xs={12}
          md={9}
        >
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Shape Preview
            </Typography>

            <Stage
              width={800}
              height={600}
            >
              <Layer>
                {/* Hex with Roads - Game Board Scale */}
                <Land tile={hex} />

                {/* Number Token */}
                <NumberToken
                  value={8}
                  position={createPoint(400, 300)}
                />

                {/* Roads around the hex using exact game coordinates */}
                {roads.map((road) => (
                  <RoadShape
                    key={road.id}
                    color={selectedColor}
                    edge={road}
                  />
                ))}

                <SettlementShape
                  color={selectedColor}
                  intersection={intersections[0]}
                  isUpgradable={true}
                />
                <CityShape
                  color={selectedColor}
                  intersection={intersections[1]}
                />
              </Layer>
            </Stage>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
