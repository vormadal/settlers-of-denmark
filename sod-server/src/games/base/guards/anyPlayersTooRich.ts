import { CardTypes, DevelopmentCardVariants } from '../../../rooms/schema/Card';
import { InputType } from '../BaseGameStateMachine';
import { BaseEvent } from '../events';

export function anyPlayersTooRich({ context, event }: InputType) {
    const e = event as BaseEvent;
    const player = context.gameState.players;

    let arePlayersTooRich = false;

    for(const [,p] of player){
        const resourceCards = p.cards(context.gameState).filter(card => card.type === CardTypes.Resource);
        if(resourceCards.length > 7){
            arePlayersTooRich = true;
            break;
        }
    }

    return arePlayersTooRich;
}