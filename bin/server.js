#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    // ws == conn. If athorize:true is passed in the connection.opts, then
    // the client connection will receive conn.authStatus after the authorize function is called.
    ws.authStatus = JSON.stringify({anonymous: true, "read_only": false, username: "GUEST"},null,0)
    wss.emit('connection', ws, request, {authorize: false})
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, () => {
  console.log(`running at '${host}' on port ${port}`)
})
