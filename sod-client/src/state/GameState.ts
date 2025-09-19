// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.35
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { BorderEdge } from './BorderEdge'
import { Intersection } from './Intersection'
import { Hex } from './Hex'
import { Player } from './Player'
import { Harbor } from './Harbor'
import { Card } from './Card'
import { HexProduction } from './HexProduction'
import { Die } from './Die'

export class GameState extends Schema {
    @type([ BorderEdge ]) public edges: ArraySchema<BorderEdge> = new ArraySchema<BorderEdge>();
    @type([ Intersection ]) public intersections: ArraySchema<Intersection> = new ArraySchema<Intersection>();
    @type([ Hex ]) public hexes: ArraySchema<Hex> = new ArraySchema<Hex>();
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type([ Harbor ]) public harbors: ArraySchema<Harbor> = new ArraySchema<Harbor>();
    @type([ Card ]) public deck: ArraySchema<Card> = new ArraySchema<Card>();
    @type("string") public phase!: string;
    @type("string") public currentPlayer!: string;
    @type([ HexProduction ]) public hexProductions: ArraySchema<HexProduction> = new ArraySchema<HexProduction>();
    @type("number") public round!: number;
    @type("number") public victoryPointsToWin!: number;
    @type("boolean") public isGameEnded!: boolean;
    @type([ "string" ]) public availableSettlementIntersections: ArraySchema<string> = new ArraySchema<string>();
    @type([ "string" ]) public availableCityIntersections: ArraySchema<string> = new ArraySchema<string>();
    @type([ "string" ]) public availableEdges: ArraySchema<string> = new ArraySchema<string>();
    @type("string") public hasLongestRoad!: string;
    @type([ Die ]) public dice: ArraySchema<Die> = new ArraySchema<Die>();
}
