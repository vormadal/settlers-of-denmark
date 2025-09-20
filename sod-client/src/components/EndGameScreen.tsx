import { useNavigate } from 'react-router-dom'
import { usePlayers, useVictoryPointsToWin } from '../hooks/stateHooks'
import { useRoom } from '../context/RoomContext'

interface EndGameScreenProps {
  onExamineBoard?: () => void
}

export function EndGameScreen({ onExamineBoard }: EndGameScreenProps) {
  const players = usePlayers()
  const vpToWin = useVictoryPointsToWin()
  const navigate = useNavigate()
  const room = useRoom()

  const maxVP = Math.max(...players.map(p => p.victoryPoints || 0), 0)
  const winners = players.filter(p => p.victoryPoints >= vpToWin && p.victoryPoints === maxVP)

  function returnToLobby() {
    try {
      room?.leave(true)
    } catch (e) {
      console.warn('Failed to leave room:', e)
    }
    navigate('/', { replace: true })
  }

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md z-50 p-2"
      style={{ background: 'rgba(10,10,30,0.55)' }}
    >
      <div 
        className="max-w-[600px] w-full rounded-2xl p-3 md:p-5 text-center relative overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg,#ffffff,#f1f3f8)' }}
      >
        {/* Background gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255,107,53,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(78,205,196,0.18), transparent 65%)'
          }}
        />
        
        <h1 className="text-3xl font-extrabold mb-2 relative">
          🏆 Game Over
        </h1>
        
        {winners.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-2 relative">
              {winners.length === 1 ? 'Winner' : 'Winners'}
            </h2>
            <div className="flex flex-col gap-1 mb-3 relative">
              {winners.map(w => (
                <div 
                  key={w.id} 
                  className="p-1.5 rounded-lg font-bold text-lg"
                  style={{ 
                    background: 'linear-gradient(90deg, rgba(255,107,53,0.15), rgba(255,255,255,0.7))' 
                  }}
                >
                  {w.name} — {w.victoryPoints} VP
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-3 font-medium">
            No winner detected.
          </p>
        )}

        <p className="text-sm mb-3 opacity-80">
          Final Scores
        </p>
        <div className="flex flex-col gap-0.5 mb-4">
          {players
            .sort((a, b) => b.victoryPoints - a.victoryPoints)
            .map(p => (
              <div 
                key={p.id} 
                className={`
                  flex justify-between bg-black/5 rounded-xl px-1.5 py-0.5
                  ${winners.some(w => w.id === p.id) 
                    ? 'font-bold shadow-[0_0_0_2px_#FF6B35]' 
                    : 'font-normal'
                  }
                `}
              >
                <span>{p.name}</span>
                <span>{p.victoryPoints} VP</span>
              </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={returnToLobby}
            className="font-bold px-4 py-1.5 rounded-3xl shadow-[0_6px_18px_rgba(78,205,196,0.4)] transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(45deg,#4ECDC4,#45B7AA)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg,#45B7AA,#3DA58A)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg,#4ECDC4,#45B7AA)'
            }}
          >
            Return to Lobby
          </button>
          {onExamineBoard && (
            <button
              onClick={onExamineBoard}
              className="font-bold px-4 py-1.5 rounded-3xl border-2 border-secondary-main backdrop-blur-sm bg-white/40 hover:bg-white/60 transition-all"
            >
              Examine Board
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EndGameScreen
