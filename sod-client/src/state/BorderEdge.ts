// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Point } from './Point'

export class BorderEdge extends Schema {
    @type(Point) public pointA: Point = new Point();
    @type(Point) public pointB: Point = new Point();
    @type("string") public id!: string;
    @type([ "string" ]) public neighbors: ArraySchema<string> = new ArraySchema<string>();
}
