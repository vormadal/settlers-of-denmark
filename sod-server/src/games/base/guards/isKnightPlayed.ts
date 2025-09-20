import { CardTypes, CardVariants } from '../../../rooms/schema/Card';
import { InputType } from '../BaseGameStateMachine';
import { PlayDevelopmentCardEvent } from '../events';

export function isKnightPlayed({ context, event }: InputType) {
    const e = event as PlayDevelopmentCardEvent;
    const card = context.gameState.deck.find(c => c.id === e.payload.cardId);

    console.log('Checking if played card is a Knight:', card.variant);

    if (!card){
        console.log('Card not found:', e.payload.cardId);
        return false;
    }

    if (card.type !== CardTypes.Development) {
        console.log('Card is not a development card:', card.type);
        return false;
    }

    return card.variant === CardVariants.Knight;
}