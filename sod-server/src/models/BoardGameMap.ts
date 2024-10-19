import { BorderEdge } from "./BorderEdge";
import { Intersection } from "./Intersection";
import { LandTiles } from "./LandTiles";
import { Point } from "./Point";




export class BoardGameMap {
    id: string;
    borderEdges: BorderEdge[] = [];
    intersections: Intersection[] = [];
    landTiles: LandTiles[] = [];

    constructor(name: string) {
        this.id = name
        this.CreateEverything(3, 6)
    }

    CreateEverything(maxValueN: number, maxValueM: number) {
        for (let i = 0; i < maxValueN; i++) {
            for (let j = 0; j < maxValueM; j++) {
                let point = CalculatePoint(i, j)
                let pointAlt = CalculatePointAlt(i, j)

                const allCurrentIntersections = this.CalculateAllIntersections(point)
                const allCurrentIntersectionsAlt = this.CalculateAllIntersections(pointAlt)

                const landTile = new LandTiles(`x${i} y${j}`, "Dessert", point, this.CalculateAllEdges(allCurrentIntersections), allCurrentIntersections)
                const landTiles = new LandTiles(`altx${i} y${j}`, "Dessert", pointAlt, this.CalculateAllEdges(allCurrentIntersectionsAlt), allCurrentIntersectionsAlt)

                this.landTiles.push(landTile)
                this.landTiles.push(landTiles)
            }
        }
    }

    CalculateAllIntersections(inputPoint: Point) {
        let allThemCurrentIntersections = []
        let lastCreatedPoint = null

        for (let index = 0; index < 6; index++) {
            const angle = (2 * Math.PI) / 6 * index
            const point = new Point(Math.cos(angle), Math.sin(angle))
            let intersection = new Intersection(`Degrees${index}${point.id}${inputPoint.id}`, point.AddPoint(inputPoint), [], [])
            const testInterseection = ContainsIntersection(intersection, this.intersections)
            if (testInterseection) {
                intersection = testInterseection
            } else {
                this.intersections.push(intersection)
            }

            allThemCurrentIntersections.push(intersection)
        }
        return allThemCurrentIntersections
    }

    CalculateAllEdges(inputPoints: Intersection[]) {

        let allCurrentEdges = []
        const points = inputPoints.map(x => x.position)
        const firstPoint = points[0]
        let lastUsePoint = points[0]

        for (let index = 1; index < points.length; index++) {
            const endPoint = points[index];
            let edge = new BorderEdge(`edge${index}${endPoint.id}${lastUsePoint.id}`, lastUsePoint, endPoint, [], [], [])

            const testEdge = ContainsEdge(edge, this.borderEdges)

            if (testEdge) {
                edge = testEdge
            } else {
                this.borderEdges.push(edge)
            }

            allCurrentEdges.push(edge)
            lastUsePoint = endPoint
        }

        let edge = new BorderEdge(`edge0`, lastUsePoint, firstPoint, [], [], [])

        const testEdge = ContainsEdge(edge, this.borderEdges)

        if (testEdge) {
            edge = testEdge
        } else {
            this.borderEdges.push(edge)
        }
        allCurrentEdges.push(edge)

        return allCurrentEdges
    }
}

function ContainsIntersection(obj: Intersection, list: Intersection[]) {

    for (var i = 0; i < list.length; i++) {
        const chosenPoint = list[i]
        if (obj.isSameAs(chosenPoint)) {
            return chosenPoint;
        }
    }
    return null;
}

function ContainsEdge(obj: BorderEdge, list: BorderEdge[]) {

    for (var i = 0; i < list.length; i++) {
        const chosenPoint = list[i]
        if (obj.IsSameAs(chosenPoint)) {
            return chosenPoint;
        }
    }
    return null;
}

function CalculatePoint(m: number, n: number) {
    return new Point(3 * m, n * Math.sqrt(3))
}

function CalculatePointAlt(m: number, n: number) {
    return new Point(3 * m + (3 / 2), (n + 0.5) * Math.sqrt(3))
}
