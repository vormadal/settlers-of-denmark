import { ArraySchema, Schema, type } from '@colyseus/schema'
import { GameState } from './GameState'
import { Card, CardTypes } from './Card'

export class HexProduction extends Schema {
  @type('string') hexType: string
  @type('string') structureType: string
  @type(['string']) resourceTypes = new ArraySchema<string>()
  // resource or valuables (gold, etc), base game only has resource
  @type('string') cardType: string

  getResources(state: GameState) {
    const resources: Card[] = []
    // maybe this logic should be in a command
    for (const resource of this.resourceTypes) {
      const availableCards = state.deck.filter((x) => !x.owner && x.type === this.cardType && resource === x.variant)
      if (availableCards.length > 0) {
        resources.push(availableCards[0])
      }
    }

    return resources
  }

  static createResource(hexType: string, structureType: string, ...resourceTypes: string[]) {
    return new HexProduction().assign({
      hexType,
      structureType,
      resourceTypes,
      cardType: CardTypes.Resource
    })
  }
}
