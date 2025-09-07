import { Command } from '@colyseus/command'
import { MyRoom } from '../../rooms/MyRoom'
import { ResourceCardVariants } from '../../rooms/schema/Card'

export interface Payload {
    playerId: string
}

export class UpdatePlayerExchangeRateCommand extends Command<MyRoom, Payload> {
    execute(payload: Payload) {
        const player = this.state.players.get(payload.playerId)

        if (!player) {
            return
        }

        const harbors = player.getHarbors(this.state);
        for(const resourceType of Object.values(ResourceCardVariants)) {
            const exchangeRate = player.exchangeRate.get(resourceType);
            for(const harbor of harbors){
                if(harbor.cardTypes.includes(resourceType) && harbor.ratio < exchangeRate.ratio){
                    exchangeRate.ratio = harbor.ratio
                }
            }
        }
    }
}

