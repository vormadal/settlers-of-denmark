// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { House } from './House'
import { Road } from './Road'
import { Card } from './Card'

export class Player extends Schema {
    @type("string") public id!: string;
    @type([ House ]) public houses: ArraySchema<House> = new ArraySchema<House>();
    @type([ Road ]) public roads: ArraySchema<Road> = new ArraySchema<Road>();
    @type([ Card ]) public cards: ArraySchema<Card> = new ArraySchema<Card>();
}
