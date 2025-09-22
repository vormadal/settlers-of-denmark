import { DevelopmentCardVariants } from '../../../rooms/schema/Card';
import { InputType } from '../BaseGameStateMachine';
import { PlayDevelopmentCardEvent } from '../events';

export function isRoadBuildingPlayed({ context, event }: InputType) {
    const e = event as PlayDevelopmentCardEvent;
    const card = context.gameState.deck.find(c => c.id === e.payload.cardId);

    if (!card){
        console.log('Card not found:', e.payload.cardId);
        return false;
    }

    return card.variant === DevelopmentCardVariants.RoadBuilding;
}