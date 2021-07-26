const WebSocket = require('./server.js');

console.log(WebSocket.WS)
WebSocket.WS.wsServer.on('connection', WebSocket.WS.onConnect)
