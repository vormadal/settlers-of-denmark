import { ArraySchema, Schema, type } from "@colyseus/schema";
import { GameState } from "./GameState";
import { Card, CardTypes } from "./Card";

export class HexProduction extends Schema {
  @type("string") hexType: string;
  @type("string") structureType: string;
  @type(["string"]) resourceTypes = new ArraySchema<string>();
  // resource or valuables (gold, etc), base game only has resource
  @type("string") cardType: string;

  getResources(state: GameState) {
    const resources: Card[] = [];

    const resourceCount = this.resourceTypes.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    for (const resource of Object.keys(resourceCount)) {
      const availableCards = state.deck.filter(
        (x) => !x.owner && x.type === this.cardType && resource === x.variant
      );

      resources.push(
        ...availableCards.slice(
          0,
          Math.min(resourceCount[resource], availableCards.length)
        )
      );
    }

    return resources;
  }

  static createResource(
    hexType: string,
    structureType: string,
    ...resourceTypes: string[]
  ) {
    return new HexProduction().assign({
      hexType,
      structureType,
      resourceTypes,
      cardType: CardTypes.Resource,
    });
  }
}
