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

export class MyRoomState extends Schema {
    @type([ BorderEdge ]) public edges: ArraySchema<BorderEdge> = new ArraySchema<BorderEdge>();
    @type([ Intersection ]) public intersections: ArraySchema<Intersection> = new ArraySchema<Intersection>();
    @type([ LandTiles ]) public LandTiles: ArraySchema<LandTiles> = new ArraySchema<LandTiles>();
    @type([ Player ]) public players: ArraySchema<Player> = new ArraySchema<Player>();
    @type("string") public state!: string;
}
