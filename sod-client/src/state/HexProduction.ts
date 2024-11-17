// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class HexProduction extends Schema {
    @type("string") public hexType!: string;
    @type("string") public structureType!: string;
    @type([ "string" ]) public resourceTypes: ArraySchema<string> = new ArraySchema<string>();
    @type("string") public cardType!: string;
}
