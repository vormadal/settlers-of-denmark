// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Intersection } from './Intersection'

export class Hex extends Schema {
    @type("string") public id!: string;
    @type("string") public type!: string;
    @type([ Intersection ]) public intersections: ArraySchema<Intersection> = new ArraySchema<Intersection>();
    @type("number") public value!: number;
}
