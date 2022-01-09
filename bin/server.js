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
  // You may check/set permissions of the user here. Set as opts.authFunction to enable pre-sync auth.
  /**
   * @param {any} y // Y.Doc
   * @param {string} token // provider.authToken
   */
  const authUser = (doc, token) => {
    // This example sets conn.isReadOnly to false.
    conn.isReadyOnly = false
    // You can set conn.authStatus to a denied reason and return false
    // if (doc.name !== token) {
    //    conn.authStatus = "Wrong Room!"
    //    return false
    // }
    // The client connection will receive conn.authStatus after the function is called.
    conn.authStatus = JSON.stringify({anonymous: true, "read_only": false, username: "GUEST"},null,0)
    return true
  }
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request, {authFunction: null})
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, () => {
  console.log(`running at '${host}' on port ${port}`)
})
