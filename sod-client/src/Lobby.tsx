import { RoomAvailable } from 'colyseus.js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useColyseus } from './context/ColyseusContext'
import { GameState } from './state/GameState'
import { RoomNames } from './utils/RoomNames'

export function Lobby() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const client = useColyseus()
  const [rooms, setRooms] = useState<RoomAvailable<GameState>[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Load name from session storage on component mount
  useEffect(() => {
    const storedName = sessionStorage.getItem('player-name')
    if (storedName) {
      setName(storedName)
    }
  }, [])

  // Save name to session storage whenever it changes
  useEffect(() => {
    if (name) {
      sessionStorage.setItem('player-name', name)
    } else {
      sessionStorage.removeItem('player-name')
    }
  }, [name])

  const refreshRooms = async () => {
    setIsRefreshing(true)
    try {
      const availableRooms = await client.getRooms()
      setRooms(availableRooms)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
    setIsRefreshing(false)
  }

  useEffect(() => {
    refreshRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createRoom = async () => {
    if (!name.trim()) {
      alert('Please enter your name first!')
      return
    }

    setIsCreating(true)
    try {
      const room = await client.createRoom(RoomNames.OneVsOne, {
        name,
      })
      if (room) {
        navigate(`/game/${room.id}?name=${encodeURIComponent(name)}`)  
      }
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Failed to create room. Please try again.')
    }
    setIsCreating(false)
  }

  const joinRoom = async (roomId: string) => {
    if (!name.trim()) {
      alert('Please enter your name first!')
      return
    }

    try {
      navigate(`/game/${roomId}?name=${encodeURIComponent(name)}`)
    } catch (error) {
      console.error('Error joining room:', error)
      alert('Failed to join room. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Settlers of Denmark
          </h1>
          <p className="text-xl text-white/80">
            Welcome to the board game lobby
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Player name input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your player name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              maxLength={20}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={createRoom}
              disabled={isCreating || !name.trim()}
              className={`flex-1 py-3 px-6 text-white font-semibold rounded-lg transition-colors ${
                isCreating || !name.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isCreating ? 'Creating...' : 'Create New Game'}
            </button>
            <button
              onClick={refreshRooms}
              disabled={isRefreshing}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                isRefreshing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Rooms'}
            </button>
          </div>

          {/* Rooms list */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Available Games ({rooms.length})
            </h2>
            
            {rooms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No games available</p>
                <p>Create a new game to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.roomId}
                    className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Game {room.roomId}
                        </h3>
                        <p className="text-gray-600">
                          {room.clients || 0} / {room.maxClients || 2} players
                        </p>
                      </div>
                      <button
                        onClick={() => joinRoom(room.roomId)}
                        disabled={!name.trim() || room.clients >= room.maxClients}
                        className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                          !name.trim() || room.clients >= room.maxClients
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {room.clients >= room.maxClients ? 'Full' : 'Join Game'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Debug link */}
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => navigate('/debug')}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Debug Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
