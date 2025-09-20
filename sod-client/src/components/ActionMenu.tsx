import React from 'react'
import { usePlayer } from '../context/PlayerContext'
import { useRoom } from '../context/RoomContext'
import { useCurrentPlayer, useDice, usePhase } from '../hooks/stateHooks'
import { useIsMobile } from '../hooks/mediaHooks'
import { PlayerCards } from './cards/PlayerCards'
import DiceComponent from './DiceComponent'

export default function ActionMenu() {
  const room = useRoom()
  const player = usePlayer()
  const currentPlayer = useCurrentPlayer()
  const dice = useDice()
  const phase = usePhase()
  const isMobile = useIsMobile()

  return (
    <div className={`flex min-w-0 h-full ${isMobile ? 'px-1 py-2 gap-3' : 'px-2 py-3 gap-4'}`}>
      {/* Cards - takes full height and most width */}
      <div className="flex-1 min-w-0 h-full flex items-start">
        {player && <PlayerCards player={player} />}
      </div>

      {/* Right column - dice and button stacked */}
      <div className={`flex flex-col items-end justify-between min-w-fit ${isMobile ? 'gap-3' : 'gap-4'}`}>
        {/* Dice at the top */}
        <div className="flex gap-2 items-right">
          {dice.map((x, i) => (
            <DiceComponent
              key={x.color}
              value={x.value}
              color={x.color}
              disabled={player?.id !== currentPlayer?.id || phase.key !== 'rollingDice'}
              onClick={() => room?.send('ROLL_DICE')}
              size={isMobile ? 'small' : 'medium'}
            />
          ))}
        </div>

        {/* End Turn button at the bottom */}
        <button
          disabled={player?.id !== currentPlayer?.id || phase.key !== 'turn'}
          onClick={() => room?.send('END_TURN')}
          className={`
            flex-shrink-0 rounded-full border-3 border-white relative transition-all duration-200 ease-out
            ${isMobile ? 'w-11 h-11' : 'w-13 h-13'}
            ${player?.id !== currentPlayer?.id || phase.key !== 'turn' 
              ? 'bg-gray-300 opacity-60 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-400 hover:scale-110 hover:rotate-[5deg] active:scale-95 cursor-pointer'
            }
          `}
          style={{
            boxShadow: player?.id !== currentPlayer?.id || phase.key !== 'turn' 
              ? '0 2px 4px rgba(0,0,0,0.2)'
              : '0 4px 8px rgba(255, 107, 53, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
          }}
        >
          {/* Gloss effect */}
          <div 
            className="absolute rounded-full bg-white/60 blur-sm"
            style={{
              top: '15%',
              left: '20%',
              width: '25%',
              height: '25%',
            }}
          />
          <span 
            className={`text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
          >
            ⏩
          </span>
        </button>
      </div>
    </div>
  )
}
