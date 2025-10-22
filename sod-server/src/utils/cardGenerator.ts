import { Card } from "../rooms/schema/Card";

export function cardGenerator(
  count: number,
  type: string,
  variant: string,
  canBePlayedBeforeRoll: boolean,
  create: (card: Card) => void): Card[] {
  return Array.from({ length: count }, (_, i) => i).map((i) => {
    const card = new Card();
    card.id = `${type}-${variant}-${i}`;
    card.type = type;
    card.variant = variant;
    card.canBePlayedBeforeRoll = canBePlayedBeforeRoll;
    create(card);
    return card;
  });
}
