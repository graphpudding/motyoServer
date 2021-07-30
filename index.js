const WebSocket = require('./server.js');

console.log(WebSocket.WS)
WebSocket.WS.wsServer.on('connection', function(wsClient){WebSocket.WS.onConnect(wsClient,WebSocket.WS)})
