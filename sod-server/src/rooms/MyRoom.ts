import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { LandTiles } from "../models/LandTiles";
import { Point } from "../models/Point";
import { Intersection } from "../models/Intersection";


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


export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    const state = new MyRoomState()
    const tiles = CreateLandTiles();
    const intersections = tiles.map(x => x.intersections.map(y => y.getStateSchema())).flat()
    state.LandTiles.push(...tiles.map(x => x.getStateSchema()))
    state.intersections.push(...intersections)



    this.setState(state);

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
