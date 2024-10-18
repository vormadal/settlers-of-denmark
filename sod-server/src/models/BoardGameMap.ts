import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";
import { Point } from "./Point";



export class BoardGameMap {
    id: string;
    borderEdges: BorderEdge[];
    intersections: Intersection[];
    landTiles: LandTiles[];

    constructor(x: number, y: number) {


        const test = new Point(3 * x, y * Math.sqrt(3))
        console.log('x:', test.x)
        console.log('y:', test.y)




    }
}