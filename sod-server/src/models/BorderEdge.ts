class BorderEdge{
    id: string;
    position: Position;
    adjacentTiles: LandTiles[];
    adjacentIntersections: Intersection[];
    adjacentBorderEdges: BorderEdge[];
}