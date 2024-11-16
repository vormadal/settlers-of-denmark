import config from '@colyseus/tools'
import { monitor } from '@colyseus/monitor'
import { playground } from '@colyseus/playground'
import express from 'express'
import path from 'path'
/**
 * Import your Room files
 */
import { MyRoom } from './rooms/MyRoom'

export default config({
  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define('my_room', MyRoom)
    if (process.env.NODE_ENV !== 'production') {
      gameServer.define('debug', MyRoom, { debug: true })
    }
  },

  initializeExpress: (app) => {
    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== 'production') {
      app.use('/', playground)
    } else {
      app.use(express.static(path.join(__dirname, 'public')))
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use('/colyseus', monitor())
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  }
})
