import React from 'react'
import { 
  Box, 
  Typography,
  Button,
  Avatar
} from '@mui/material'
import { Player } from '../state/Player'
import { useRoom } from '../context/RoomContext'
import { usePlayer } from '../context/PlayerContext'
import { getUniqueColor } from '../utils/colors'
import { useDeck } from '../hooks/stateHooks'
import { Card } from '../state/Card'
import { GameModal } from './GameModal'

interface Props {
  open: boolean
  onClose: () => void
  eligiblePlayers: Player[]
}

export function StealResourceModal({ open, onClose, eligiblePlayers }: Props) {
  const room = useRoom()
  const deck = useDeck()
  const player = usePlayer()

  const handleStealFromPlayer = (victimId: string) => {
    if (player) {
      room?.send('STEAL_RESOURCE', { 
        playerId: player.id,
        victimId: victimId 
      })
    }
    onClose()
  }

  // Get resource cards count for a player
  const getPlayerResourceCount = (playerId: string): number => {
    return deck.filter((card: Card) => card.owner === playerId && card.type === 'Resource').length
  }

  return (
    <GameModal
      open={open}
      onClose={onClose}
      title="🏴‍☠️ Steal Resource"
      accentColor="#f44336"
      maxWidth="sm"
      fullWidth
    >
        {eligiblePlayers.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            padding: 4,
            opacity: 0.7 
          }}>
            <Typography variant="h6">No Players to Steal From</Typography>
            <Typography variant="body2" sx={{ marginTop: 1, marginBottom: 2 }}>
              No players have structures adjacent to this hex
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => handleStealFromPlayer('')}
              sx={{ backgroundColor: '#666', '&:hover': { backgroundColor: '#555' } }}
            >
              Continue
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={{ marginBottom: 3, textAlign: 'center' }}>
              Choose a player to steal a resource card from:
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {eligiblePlayers.map((player, index) => {
                const playerColor = getUniqueColor(index)
                // Get total resource cards for this player
                const resourceCardCount = getPlayerResourceCount(player.id)
                const hasResources = resourceCardCount > 0
                
                return (
                  <Button
                    key={player.id}
                    variant="outlined"
                    onClick={() => handleStealFromPlayer(player.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 2,
                      backgroundColor: hasResources ? 'rgba(244, 67, 54, 0.05)' : 'rgba(0,0,0,0.02)',
                      border: `2px solid ${hasResources ? 'rgba(244, 67, 54, 0.3)' : 'rgba(0,0,0,0.15)'}`,
                      opacity: hasResources ? 1 : 0.9,
                      '&:hover': {
                        backgroundColor: hasResources ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0,0,0,0.05)',
                        borderColor: hasResources ? 'rgba(244, 67, 54, 0.5)' : 'rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: playerColor,
                          width: 40,
                          height: 40,
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {player.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {resourceCardCount} resource card{resourceCardCount !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {!hasResources ? (
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'right' }}
                      >
                        No resources
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Steal →
                      </Typography>
                    )}
                  </Button>
                )
              })}
            </Box>
          </>
        )}
        
        <Box sx={{ 
          marginTop: 3, 
          padding: 2, 
          backgroundColor: 'rgba(244, 67, 54, 0.05)',
          borderRadius: 2,
          border: '1px solid rgba(244, 67, 54, 0.1)'
        }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
            💡 You will randomly steal one resource card from the selected player
          </Typography>
        </Box>
    </GameModal>
  )
}