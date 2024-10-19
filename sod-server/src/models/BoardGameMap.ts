import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";
import { Point } from "./Point";




export class BoardGameMap {
    id: string;
    borderEdges: BorderEdge[];
    intersections: Intersection[];
    landTiles: LandTiles[];

    constructor(name: string) {
        this.id = name
        this.landTiles = CreateLandTiles()
    }
}

function CreateLandTiles() {
    const maxValueN = 3;
    const maxValueM = 6;
    var allThemLandTiles = []
  
  
    for (let i = 0; i < maxValueN; i++) {
      for (let j = 0; j < maxValueM; j++) {
        const point = CalculatePoint(i, j)
        const pointAlt = CalculatePointAlt(i, j)

        allThemLandTiles.push(new LandTiles(`x${i} y${j}`, "Dessert", point, [], CalculateIntersections(point)))
        allThemLandTiles.push(new LandTiles(`fx${i} y${j}`, "Dessert", pointAlt, [], CalculateIntersections(pointAlt)))
      }
    }
  
    return allThemLandTiles
  }

  function containsObject(obj: Point, list: []) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

  function CalculatePoint(m: number, n: number) {
    return new Point(3 * m, n * Math.sqrt(3))
  }
  
  function CalculatePointAlt(m: number, n: number) {
    return new Point(3 * m + (3 / 2), (n + 0.5) * Math.sqrt(3))
  }
  
  function CalculateIntersections(inputPoint: Point) {
    var allThemIntersections = []
    for (let index = 0; index < 6; index++) {
      const angle = (2 * Math.PI) / 6 * index
      const point = new Point(Math.cos(angle), Math.sin(angle))
      allThemIntersections.push(new Intersection(`Degrees${index}`, point.AddPoint(inputPoint), [], []))
  
    }
    return allThemIntersections
  }