// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { BorderEdge } from './BorderEdge'
import { Intersection } from './Intersection'
import { LandTiles } from './LandTiles'
import { Player } from './Player'

export class GameState extends Schema {
    @type([ BorderEdge ]) public edges: ArraySchema<BorderEdge> = new ArraySchema<BorderEdge>();
    @type([ Intersection ]) public intersections: ArraySchema<Intersection> = new ArraySchema<Intersection>();
    @type([ LandTiles ]) public landTiles: ArraySchema<LandTiles> = new ArraySchema<LandTiles>();
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type("string") public phase!: string;
    @type("string") public phaseStep!: string;
    @type("string") public currentPlayer!: string;
    @type("number") public round!: number;
    @type([ "string" ]) public availableIntersections: ArraySchema<string> = new ArraySchema<string>();
    @type([ "string" ]) public availableEdges: ArraySchema<string> = new ArraySchema<string>();
}
