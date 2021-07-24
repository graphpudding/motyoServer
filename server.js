const WebSocket = require('ws');

//wsServer.on('connection', onConnect);

let Connection = class {
  constructor() {
      this.wsServer = new WebSocket.Server({
        port: 9000
      });
    }
    onConnect(wsClient) {
      console.log('Новый пользователь');
      // отправка приветственного сообщения клиенту
      wsClient.send('Привет');
      wsClient.on('message', function(message) {
        console.log(message);
        try {
          // сообщение пришло текстом, нужно конвертировать в JSON-формат
          const jsonMessage = JSON.parse(message);
          switch (jsonMessage.action) {
            case 'ECHO':
              wsClient.send(jsonMessage.data);
              break;
            case 'PING':
              setTimeout(function() {
                wsClient.send('PONG');
              }, 2000);
              break;
            default:
              console.log('Неизвестная команда');
              break;
          }
        } catch (error) {
          console.log('Ошибка', error);
        }
      })
      wsClient.on('close', function() {
        // отправка уведомления в консоль
        console.log('Пользователь отключился');
      })
    }
}
exports.WS = new Connection();
