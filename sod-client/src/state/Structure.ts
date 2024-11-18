// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Structure extends Schema {
    @type("string") public id!: string;
    @type("string") public type!: string;
    @type("string") public owner!: string;
    @type("string") public intersection!: string;
    @type("int16") public round!: number;
}
