import { MapSchema, Schema, type } from '@colyseus/schema'
import { CardCost } from './CardCost'

export const CardTypes = {
  Resource: 'Resource',
  Development: 'Development'
}

export const ResourceCardVariants = {
  Lumber: 'Lumber',
  Wool: 'Wool',
  Grain: 'Grain',
  Ore: 'Ore',
  Brick: 'Brick'
}

export const DevelopmentCardVariants = {
  Knight: 'Knight',
  Monopoly: 'Monopoly',
  RoadBuilding: 'RoadBuilding',
  VictoryPoint: 'VictoryPoint',
  YearOfPlenty: 'YearOfPlenty',
  Merchant: 'Merchant'
}

export const CardVariants = {
  ...ResourceCardVariants,
  ...DevelopmentCardVariants
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
  @type('number') boughtInTurn?: number
  @type('string') playedBy?: string
}
