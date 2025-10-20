import { Room } from 'colyseus.js'
import { GameState } from './state/GameState'
import * as Colyseus from 'colyseus.js'
import { RoomNames } from './utils/RoomNames'

export class ColyseusClient {
  client: Colyseus.Client

  _room: Room<GameState> | null = null
  get room() {
    return this._room
  }
  set room(value: Room<GameState> | null) {
    this._room = value
    console.log('colyseus: room set:', { sessionId: value?.sessionId, id: value?.id, roomId: value?.roomId })
  }

  isConnecting = false

  constructor() {
    this.client = new Colyseus.Client(
      process.env.NODE_ENV === 'production' ? `wss://${window.location.hostname}` : 'ws://localhost:2567'
    )
  }

  get reconnectionToken(): string | null {
    return sessionStorage.getItem('reconnectionToken')
  }

  set reconnectionToken(token: string | null) {
    if (token === null) {
      sessionStorage.removeItem('reconnectionToken')
      return
    }
    sessionStorage.setItem('reconnectionToken', token)
  }

  async createRoom(name: RoomNames, options?: any): Promise<Room<GameState> | null> {
    if (this.isConnecting) return this.room
    this.isConnecting = true

    console.log('colyseus: creating room:', name)
    this.room = await this.client.create(name, options)

    this.reconnectionToken = this.room.reconnectionToken
    this.isConnecting = false
    return this.room
  }

  async joinRoom(roomId: string, name?: string | null): Promise<Room<GameState> | null> {
    if (this.isConnecting) return this.room
    if (this.room) return this.room
    this.isConnecting = true

    console.log('colyseus: joining room:', roomId)
    this.room = await this.reconnect(roomId)

    if (!this.room) {
      this.room = await this.client.joinById<GameState>(roomId, { name })
    }

    if (this.room) {
      this.reconnectionToken = this.room.reconnectionToken
    }
    this.isConnecting = false
    return this.room
  }

  private async reconnect(roomId: string) {
    if (!this.reconnectionToken || !this.reconnectionToken.includes(roomId)) return this.room

    try {
      this.room = await this.client.reconnect(this.reconnectionToken)
      return this.room
    } catch (e) {
      console.error('colyseus: reconnect failed:', e)
      this.reconnectionToken = null
      return null
    }
  }

  // TODO add listener instead perhaps?
  getRooms() {
    return this.client.getAvailableRooms<GameState>()
  }
}
