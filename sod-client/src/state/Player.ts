// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Settlement } from './Settlement'
import { City } from './City'
import { Road } from './Road'

export class Player extends Schema {
    @type("string") public id!: string;
    @type("string") public name!: string;
    @type("boolean") public connected!: boolean;
    @type([ Settlement ]) public settlements: ArraySchema<Settlement> = new ArraySchema<Settlement>();
    @type([ City ]) public cities: ArraySchema<City> = new ArraySchema<City>();
    @type([ Road ]) public roads: ArraySchema<Road> = new ArraySchema<Road>();
}
