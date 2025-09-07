// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { BorderEdge } from './BorderEdge'

export class Harbor extends Schema {
    @type(BorderEdge) public edge: BorderEdge = new BorderEdge();
    @type("string") public id!: string;
    @type([ "string" ]) public cardTypes: ArraySchema<string> = new ArraySchema<string>();
    @type("number") public ratio!: number;
}
