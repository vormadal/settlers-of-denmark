import { MapSchema, Schema, type } from '@colyseus/schema'
import { CardCost } from './CardCost'

export const CardTypes = {
  Resource: 'Resource',
  Development: 'Development'
}

export const CardVariants = {
  // resources
  Lumber: 'Lumber',
  Wool: 'Wool',
  Grain: 'Grain',
  Ore: 'Ore',
  Brick: 'Brick',
  // development cards
  Knight: 'Knight',
  VictoryPoint: 'VictoryPoint',
  RoadBuilding: 'RoadBuilding',
  Monopoly: 'Monopoly',
  YearOfPlenty: 'YearOfPlenty',
  Merchant: 'Merchant'
}

export class Card extends Schema {
  @type('string') id: string
  @type('string') name: string
  @type('string') description: string
  @type('string') type: string
  @type('string') variant: string
  // only applicable for development cards
  @type({ map: CardCost }) cost = new MapSchema<CardCost>()
  @type('string') owner?: string

  @type('string') playedBy?: string
}
