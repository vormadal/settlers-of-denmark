// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { CardCost } from './CardCost'

export class Card extends Schema {
    @type("string") public id!: string;
    @type("string") public name!: string;
    @type("string") public description!: string;
    @type("string") public type!: string;
    @type("string") public variant!: string;
    @type({ map: CardCost }) public cost: MapSchema<CardCost> = new MapSchema<CardCost>();
    @type("string") public owner!: string;
}
