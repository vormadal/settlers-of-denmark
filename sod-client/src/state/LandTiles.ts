// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Point } from './Point'

export class LandTiles extends Schema {
    @type(Point) public position: Point = new Point();
    @type("number") public radius!: number;
    @type("string") public id!: string;
    @type("string") public type!: string;
    @type([ "string" ]) public edges: ArraySchema<string> = new ArraySchema<string>();
    @type([ "string" ]) public intersections: ArraySchema<string> = new ArraySchema<string>();
}
